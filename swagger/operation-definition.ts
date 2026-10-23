// @ts-expect-error The existing js-yaml dependency does not ship declarations.
import yaml from 'js-yaml'

const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'])

/** A standalone slice of the published spec, retaining references rather than
 * expanding recursive schemas. Input must be the normalized loadSpec result. */
export function operationDefinition(spec: Record<string, any>, path: string, method: string) {
    const source = JSON.parse(JSON.stringify(spec))
    const pathItem = source.paths?.[path]
    if (!methods.has(method) || !pathItem?.[method]) {
        throw new Error(`Missing OpenAPI operation: ${method} ${path}`)
    }
    const { paths, components, tags, ...metadata } = source
    const operation = pathItem[method]
    const inherited = Object.fromEntries(Object.entries(pathItem).filter(([key]) => !methods.has(key)))
    const result: Record<string, any> = {
        ...metadata,
        ...(tags ? { tags: tags.filter((tag: any) => operation.tags?.includes(tag.name)) } : {}),
        paths: { [path]: { ...inherited, [method]: operation } },
    }
    // Explicit empty security overrides global security; preserve that distinction.
    const security = operation.security ?? source.security
    if (security !== undefined) result.security = security
    const visited = new Set<string>()

    function include(ref: string) {
        if (visited.has(ref)) return
        if (!ref.startsWith('#/components/')) {
            throw new Error(`Unsupported OpenAPI reference in ${method} ${path}: ${ref}`)
        }
        visited.add(ref)
        const keys = ref.slice(2).split('/').map(key => decodeURIComponent(key).replace(/~1/g, '/').replace(/~0/g, '~'))
        let value: any = source
        for (const key of keys) {
            if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
                throw new Error(`Unresolved OpenAPI reference in ${method} ${path}: ${ref}`)
            }
            value = value[key]
        }
        // Include the whole named component even if the pointer targets a child.
        const [section, category, name] = keys
        if (!name) throw new Error(`Invalid component reference: ${ref}`)
        result[section] ??= {}
        result[section][category] ??= {}
        if (!Object.prototype.hasOwnProperty.call(result[section][category], name)) {
            result[section][category][name] = source[section][category][name]
            visit(source[section][category][name])
        }
    }

    function visit(value: any) {
        if (!value || typeof value !== 'object') return
        if (typeof value.$ref === 'string') include(value.$ref)
        // Security requirements use scheme names, not $ref.
        if (Array.isArray(value.security)) {
            for (const requirement of value.security) {
                for (const name of Object.keys(requirement)) {
                    include(`#/components/securitySchemes/${name.replace(/~/g, '~0').replace(/\//g, '~1')}`)
                }
            }
        }
        for (const child of Object.values(value)) visit(child)
    }
    visit(result)
    return result
}

export function operationDefinitionMarkdown(spec: Record<string, any>, path: string, method: string) {
    const text: string = yaml.dump(operationDefinition(spec, path, method), { noRefs: true, lineWidth: -1 })
    // A longer fence protects examples/descriptions that themselves contain fences.
    const fence = '`'.repeat(Math.max(3, ...Array.from(text.matchAll(/`+/g), match => match[0].length + 1)))
    return `${fence}yaml\n${text}${fence}\n`
}

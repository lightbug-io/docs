import { revealApiDefinition } from './ApiDefinitionAnchor'

describe('OpenAPI definition navigation', () => {
    beforeEach(() => {
        document.body.innerHTML = '<h2 id="openapi-definition">OpenAPI definition</h2><div class="api-definition"><details><summary>Definition</summary>YAML</details></div>'
        document.getElementById('openapi-definition')!.scrollIntoView = jest.fn()
        history.replaceState({}, '', '/apis/v2/get-devices')
    })

    test('ordinary page navigation leaves the definition closed', () => {
        revealApiDefinition()
        expect(document.querySelector('details')!.open).toBe(false)
    })

    test('initial hash and same-page router pushState reveal a closed definition repeatedly', () => {
        // Pagefind uses router.go/pushState, which does not emit hashchange.
        history.pushState({}, '', '#openapi-definition')
        revealApiDefinition()
        expect(document.querySelector('details')!.open).toBe(true)
        document.querySelector('details')!.open = false
        history.pushState({}, '', '#openapi-definition')
        revealApiDefinition()
        expect(document.querySelector('details')!.open).toBe(true)
        expect(document.getElementById('openapi-definition')!.scrollIntoView).toHaveBeenCalledTimes(2)
    })

    test('navigation to another page with no definition is harmless', () => {
        history.pushState({}, '', '/other#openapi-definition')
        document.body.innerHTML = ''
        expect(revealApiDefinition).not.toThrow()
    })
})

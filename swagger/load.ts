import spec1 from '../public/swagger/v1.json' with { type: 'json' }
import spec2 from '../public/swagger/v2.json' with { type: 'json' }
import {
    v1SummaryOverrides,
    v1DescriptionOverrides,
    v1Deprecated,
    v1ReTag,
    v1Removed,
    V1ParamExamples,
    V1ResponseExamples,
    V1BodyExamples,
    V1ParamDescriptions,
    V1ParamSchemaFormats,
    V1ParamSchemaTypes,
    V1SchemaPropertyOverrides
} from './v1-overrides'

var apiKeyDescription = "API Key for authentication. Retrieval from either API version login routes, or other authentication token type. See <a href='/apis/authentication'>Authentication</a> for more details."
// https://github.com/enzonotario/vitepress-openapi/issues/236
// var apiKeyExample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3Mjc2NjAyOCwiZXhwIjoxNjc0NDk0MDI4fQ.kCak9sLJr74frSRVQp0_27BY4iBCgQSmoT3vQVWKzJg"
var apiKeyExample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

export function loadSpec(version: number): any {
    if (version === 1) {
        (spec1.components as any).securitySchemes = {
            ApiKeyAuth: {
                in: 'header',
                name: 'Authorization',
                type: 'apiKey',
                description: apiKeyDescription,
                example: apiKeyExample
            }
        }
        // And add the security to the endpoints (everything except things with "login" in them)
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                if (!path.includes('login')) {
                    spec1.paths[path][method].security = [{ ApiKeyAuth: [] }]
                }
            }
        }

        // override stuff
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                let normalizedOperationId = method + path.replace(/\//g, '-').replace(/{/g, '').replace(/}/g, '')
                normalizedOperationId = normalizedOperationId.replace(/_/g, '-')
                spec1.paths[path][method].operationId = normalizedOperationId
                let operationId = spec1.paths[path][method].operationId
                if (v1Removed.includes(operationId)) {
                    delete spec1.paths[path][method]
                    continue
                }
                if (operationId in v1SummaryOverrides) {
                    spec1.paths[path][method].summary = v1SummaryOverrides[operationId]
                }
                if (operationId in v1DescriptionOverrides) {
                    spec1.paths[path][method].description = v1DescriptionOverrides[operationId]
                }
                if (operationId in v1ReTag) {
                    spec1.paths[path][method].tags = [v1ReTag[operationId]]
                }
                if (operationId in V1ParamExamples) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamExamples[operationId]) {
                            param.example = V1ParamExamples[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1ResponseExamples) {
                    for (const response of Object.keys(spec1.paths[path][method].responses)) {
                        if (response in V1ResponseExamples[operationId]) {
                            spec1.paths[path][method].responses[response].content = V1ResponseExamples[operationId][response]
                        }
                    }
                }
                if (operationId in V1ParamDescriptions) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamDescriptions[operationId]) {
                            param.description = V1ParamDescriptions[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1ParamSchemaFormats) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamSchemaFormats[operationId]) {
                            param.schema.format = V1ParamSchemaFormats[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1ParamSchemaTypes) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamSchemaTypes[operationId]) {
                            param.schema.type = V1ParamSchemaTypes[operationId][param.name]
                        }
                    }
                }
                if (operationId in v1Deprecated) {
                    spec1.paths[path][method].deprecated = true
                    // Until this is actually rendered, also prefix the summary with "Deprecated"
                    spec1.paths[path][method].summary = `Deprecated: ${spec1.paths[path][method].summary}`
                    // and the description
                    spec1.paths[path][method].description = `This endpoint is deprecated. ${spec1.paths[path][method].description}`
                }
                // If a method has a parameter called include, then it is never required...
                if (spec1.paths[path][method].parameters) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name === 'include') {
                            param.required = false
                        }
                    }
                }
                // Remove RTK> from all
                if (spec1.paths[path][method].summary) {
                    spec1.paths[path][method].summary = spec1.paths[path][method].summary.replace('RTK>', '')
                }
                if (spec1.paths[path][method].description) {
                    spec1.paths[path][method].description = spec1.paths[path][method].description.replace('RTK>', '')
                }

                // Remove everything except application/json from them all
                if (spec1.paths[path][method].responses) {
                    for (const response of Object.keys(spec1.paths[path][method].responses)) {
                        if (response === '200' && spec1.paths[path][method].responses[response].content) {
                            const content = spec1.paths[path][method].responses[response].content
                            for (const type of Object.keys(content)) {
                                if (type !== 'application/json') {
                                    delete content[type]
                                }
                            }
                        } else {
                            delete spec1.paths[path][method].responses[response]
                        }
                    }
                }
            }
        }

        // Make sure that all schemas have "type": "object", if they don't have another type defined
        if (spec1.components.schemas) {
            for (const schema of Object.keys(spec1.components.schemas)) {
                if (!spec1.components.schemas[schema].type) {
                    spec1.components.schemas[schema].type = 'object'
                }
            }
        }
        // Apply schema property overrides
        if (spec1.components && spec1.components.schemas) {
            for (const schemaName in V1SchemaPropertyOverrides) {
                if (spec1.components.schemas[schemaName]) {
                    const schema = spec1.components.schemas[schemaName];
                    const overrides = V1SchemaPropertyOverrides[schemaName];
                    for (const propertyName in overrides) {
                        if (schema.properties && schema.properties[propertyName]) {
                            Object.assign(schema.properties[propertyName], overrides[propertyName]);
                        }
                    }
                }
            }
        }
        return spec1
    }
    if (version === 2) {
        // Remove any servers that include "localhost"
        if (spec2.servers) {
            spec2.servers = spec2.servers.filter((server: any) => !server.url.includes('localhost'))
        }
        // Add normalizedOperationId to each operation
        for (const path of Object.keys(spec2.paths)) {
            for (const method of Object.keys(spec2.paths[path])) {
                let normalizedOperationId = method + path.replace(/\//g, '-').replace(/{/g, '').replace(/}/g, '')
                normalizedOperationId = normalizedOperationId.replace(/_/g, '-')
                spec2.paths[path][method].operationId = normalizedOperationId
            }
        }
        // Add description to ApiKeyAuth if it exists
        if (spec2.components && spec2.components.securitySchemes && spec2.components.securitySchemes.ApiKeyAuth) {
            spec2.components.securitySchemes.ApiKeyAuth.description = apiKeyDescription
            spec2.components.securitySchemes.ApiKeyAuth.example = apiKeyExample
        }
        return spec2
    }
    return null
}

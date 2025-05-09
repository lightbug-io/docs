import { useOpenapi } from 'vitepress-openapi/client'
import { httpVerbs } from 'vitepress-openapi'
import { loadSpec } from '../../swagger/load'
const spec = loadSpec(2)

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.spec?.paths) {
            console.error('No paths found in OpenAPI spec version 2')
            return []
        }

        return Object.keys(openapi.spec.paths)
            .flatMap((path) => {
                return httpVerbs
                    .filter((verb) => openapi.spec.paths[path][verb])
                    .map((verb) => {
                        const { operationId, summary } = openapi.spec.paths[path][verb]
                        return {
                            params: {
                                operationId,
                                pageTitle: `Version 2: ${summary}`,
                            },
                        }
                    })
            })
    },
}

import { useOpenapi, httpVerbs } from 'vitepress-openapi'
import { loadSpec } from '../../swagger/load'
const spec1 = loadSpec(1)

export default {
    paths() {
        const openapi = useOpenapi({ spec: spec1 })

        if (!openapi?.json?.paths) {
            return []
        }

        return Object.keys(openapi.json.paths)
            .flatMap((path) => {
                return httpVerbs
                    .filter((verb) => openapi.json.paths[path][verb])
                    .map((verb) => {
                        const { operationId, summary } = openapi.json.paths[path][verb]
                        return {
                            params: {
                                operationId,
                                pageTitle: `Version 1: ${summary}`,
                            },
                        }
                    })
            })
    },
}

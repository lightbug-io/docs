import fs from 'node:fs'
import jsyaml from 'js-yaml'
import { validateMessageDocumentation } from './utils/MessageDocumentation'

export interface YamlDataInterface {
  [key: string]: any
}

export default {
  watch: ['./public/files/protocol-v3.yaml'],
  load(watchedFiles: string[]): YamlDataInterface {
    if (watchedFiles.length === 0) {
      return {}
    }

    const yamlFile = watchedFiles[0]
    const yamlContent = fs.readFileSync(yamlFile, 'utf-8')
    const parsedYaml = jsyaml.load(yamlContent) as YamlDataInterface

    const documentationErrors = Object.keys(parsedYaml.messages || {}).flatMap(id =>
      validateMessageDocumentation(parsedYaml, Number(id)))
    if (documentationErrors.length) throw new Error(documentationErrors.join('\n'))

    return parsedYaml
  }
}

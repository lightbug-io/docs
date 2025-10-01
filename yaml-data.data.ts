import fs from 'node:fs'
import jsyaml from 'js-yaml'

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

    return parsedYaml
  }
}

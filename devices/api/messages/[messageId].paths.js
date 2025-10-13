import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'

// Load protocol data at build time
const protocolYamlPath = path.resolve(__dirname, '../../../public/files/protocol-v3.yaml')
const protocolYaml = fs.readFileSync(protocolYamlPath, 'utf8')
const protocolData = yaml.load(protocolYaml)

// Dynamically detect custom message pages by checking for existing .md files
// that match the pattern {messageId}-*.md or {messageId}.md
const messagesDir = __dirname
const customMessagePages = fs.readdirSync(messagesDir)
    .filter(file => file.endsWith('.md') && file !== '[messageId].md' && file !== 'index.md' && !file.startsWith('overview-'))
    .map(file => {
        const match = file.match(/^(\d+)/)
        return match ? parseInt(match[1]) : null
    })
    .filter(id => id !== null)

export default {
    paths() {
        if (!protocolData?.messages) {
            console.error('No messages found in protocol data')
            return []
        }

        return Object.keys(protocolData.messages)
            .map(messageId => parseInt(messageId))
            .filter(messageId => !customMessagePages.includes(messageId))
            .map((messageId) => {
                const messageData = protocolData.messages[messageId]
                const urlName = messageData.name.toLowerCase().replace(/ /g, '-')
                return {
                    params: {
                        messageId: `${messageId}-${urlName}`,
                        pageTitle: `${messageId}: ${messageData.name}`,
                    },
                }
            })
    },
}

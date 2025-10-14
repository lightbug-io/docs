import { computed } from 'vue'

/**
 * Composable to check if message sections have content
 * @param {number|import('vue').Ref<number>} messageId - The message ID
 * @param {Object} protocolData - The protocol data object
 * @returns {Object} Object with hasHeader, hasPayload, and hasExamples computed properties
 */
export function useMessageSections(messageId, protocolData) {
  const hasHeader = computed(() => {
    const msgData = protocolData?.messages?.[messageId]
    return msgData?.header && msgData.header.length > 0
  })

  const hasPayload = computed(() => {
    const msgData = protocolData?.messages?.[messageId]
    const fields = msgData?.data || []
    return fields && typeof fields === 'object' && Object.keys(fields).length > 0
  })

  const hasExamples = computed(() => {
    const msgData = protocolData?.messages?.[messageId]
    const examples = msgData?.examples || []
    return examples.length > 0
  })

  return {
    hasHeader,
    hasPayload,
    hasExamples
  }
}

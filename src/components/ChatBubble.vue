<template>
  <div :class="['msgRow', message.role === 'user' ? 'user' : 'bot']">
    <div class="avatar">{{ message.role === 'user' ? 'EU' : 'Φ' }}</div>
    <div>
      <div class="bubble" ref="bubbleRef">
        <span v-if="message.text === '__TYPING__'" class="typing">
          <i /><i /><i />
        </span>
        <div v-else v-html="rendered" />
      </div>
      <div class="meta">{{ message.meta }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import type { Mensagem } from '../types'
import { renderMarkdown, highlightCode } from '../composables/useMarkdown'

const props = defineProps<{ message: Mensagem }>()

const bubbleRef = ref<HTMLElement | null>(null)

const rendered = computed(() => {
  if (props.message.text === '__TYPING__') return ''
  return renderMarkdown(props.message.text)
})

watch(rendered, async () => {
  await nextTick()
  if (bubbleRef.value) highlightCode(bubbleRef.value)
}, { immediate: true })
</script>

<style scoped>
.msgRow {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid var(--border);
  background: rgba(17, 28, 51, 0.45);
  color: var(--muted);
  flex: 0 0 auto;
}

.bubble {
  max-width: 840px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(17, 28, 51, 0.35);
  line-height: 1.6;
  font-size: 14px;
  word-break: break-word;
  overflow-x: auto;
}

.user .bubble { background: rgba(31, 41, 55, 0.55); }
.bot .bubble  { background: rgba(11, 18, 36, 0.55); }

.bubble :deep(p) { margin: 0.4em 0; }
.bubble :deep(p:first-child) { margin-top: 0; }
.bubble :deep(p:last-child)  { margin-bottom: 0; }
.bubble :deep(ul),
.bubble :deep(ol) { padding-left: 1.4em; margin: 0.4em 0; }
.bubble :deep(li) { margin: 0.2em 0; }
.bubble :deep(h1),
.bubble :deep(h2),
.bubble :deep(h3) { margin: 0.6em 0 0.3em; font-size: 1em; }
.bubble :deep(pre) {
  background: #0d1117;
  border-radius: 8px;
  padding: 10px 12px;
  overflow-x: auto;
  margin: 0.5em 0;
}
.bubble :deep(code:not(pre code)) {
  background: rgba(34, 197, 94, 0.12);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.9em;
}
.bubble :deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 0;
  margin: 0.5em 0;
}

.meta {
  color: var(--muted);
  font-size: 11px;
  margin-top: 6px;
}

.typing {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  display: inline-block;
  animation: bounce 1s infinite;
  opacity: 0.8;
}
.typing i:nth-child(2) { animation-delay: 0.12s; }
.typing i:nth-child(3) { animation-delay: 0.24s; }

@keyframes bounce {
  0%, 100% { transform: translateY(0);   opacity: 0.45; }
  50%       { transform: translateY(-3px); opacity: 0.95; }
}
</style>

<template>
  <section class="composer">
    <div class="composeRow">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        placeholder="Digite sua dúvida de Física… (ex.: 'Explique energia cinética com exemplo')"
        @keydown="onKeydown"
        @input="autoResize"
      />
      <button class="send" title="Enviar" @click="handleSend">➤</button>
    </div>
    <div v-if="showDisclaimer" class="footerNote">
      <b>Protótipo educacional.</b> O assistente pode errar. Não use como única fonte.
      Se estiver resolvendo exercícios, peça para ele mostrar as etapas e confira os cálculos.
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ showDisclaimer: boolean }>()
const emit = defineEmits<{ send: [text: string] }>()

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function autoResize(): void {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function handleSend(): void {
  const text = inputText.value.trim()
  if (!text) return
  emit('send', text)
  inputText.value = ''
  if (textareaRef.value) textareaRef.value.style.height = 'auto'
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

defineExpose({ setValue: (v: string) => { inputText.value = v } })
</script>

<style scoped>
.composer {
  padding: 14px 18px;
  border-top: 1px solid var(--border);
  background: rgba(15,23,42,.55);
}
.composeRow {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
textarea {
  width: 100%;
  min-height: 46px;
  max-height: 160px;
  resize: none;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(17,28,51,.35);
  color: var(--text);
  font-size: 14px;
  outline: none;
  font-family: var(--font);
  transition: border-color .15s, box-shadow .15s;
}
textarea:focus {
  border-color: rgba(34,197,94,.35);
  box-shadow: 0 0 0 4px rgba(34,197,94,.1);
}
.send {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(34,197,94,.16);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: var(--text);
  flex: 0 0 auto;
  transition: background .15s;
}
.send:hover { background: rgba(34,197,94,.28); }
.footerNote {
  margin-top: 10px;
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.35;
}

@media (max-width: 900px) {
  .composer { padding: 12px 14px; }
}
</style>

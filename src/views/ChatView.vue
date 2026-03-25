<template>
  <div class="layout">
    <AppSidebar
      @new-chat="handleNewChat"
      @select-example="handleExample"
    />

    <main class="main">
      <!-- Topbar -->
      <header class="topbar">
        <div class="title">
          <h3>Chat de Estudos — Física</h3>
          <small>Foco: Ensino Médio • Monitor/Assistente • Protótipo</small>
        </div>
        <button class="btn secondary" @click="showDisclaimer = !showDisclaimer">
          {{ showDisclaimer ? 'Ocultar aviso' : 'Mostrar aviso' }}
        </button>
      </header>

      <!-- Messages -->
      <section ref="chatEl" class="chat">
        <ChatBubble
          v-for="(msg, idx) in currentChat?.mensagens"
          :key="msg.id ?? idx"
          :message="msg"
        />
      </section>

      <!-- Composer -->
      <ChatComposer
        ref="composerRef"
        :show-disclaimer="showDisclaimer"
        @send="handleSend"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import ChatBubble from '../components/ChatBubble.vue'
import ChatComposer from '../components/ChatComposer.vue'
import { useChat } from '../composables/useChat'

const { currentChat, carregar, criarChat, ensureIntro, sendMessage } = useChat()

const chatEl = ref<HTMLElement | null>(null)
const composerRef = ref<InstanceType<typeof ChatComposer> | null>(null)
const showDisclaimer = ref(false)

function scrollToBottom(): void {
  nextTick(() => {
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  })
}

async function handleSend(text: string): Promise<void> {
  await sendMessage(text)
  scrollToBottom()
}

function handleNewChat(): void {
  criarChat()
  ensureIntro()
  scrollToBottom()
}

function handleExample(query: string): void {
  composerRef.value?.setValue(query)
}

// Watch for new messages → scroll
watch(
  () => currentChat.value?.mensagens.length,
  () => scrollToBottom()
)

onMounted(() => {
  carregar()
  if (!currentChat.value) criarChat()
  ensureIntro()
  scrollToBottom()
})
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.topbar {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: rgba(15,23,42,.55);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.topbar .title { display: flex; flex-direction: column; gap: 2px; }
.topbar h3 { margin: 0; font-size: 14px; letter-spacing: .2px; }
.topbar small { color: var(--muted); }

.chat {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  border: 1px solid var(--border);
  background: rgba(34,197,94,.12);
  color: var(--text);
  padding: 9px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: .15s transform;
}
.btn:hover { transform: translateY(-1px); }
.btn.secondary { background: rgba(17,28,51,.35); }

@media (max-width: 900px) {
  .chat { padding: 14px; }
  .topbar { padding: 12px 14px; }
}
</style>

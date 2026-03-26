import { ref, computed } from 'vue'
import type { Chat, Mensagem } from '../types'
import { API_URL, MODEL, INTRO_TEXT } from '../types'
import { useUser } from './useUser'

const STORAGE_KEY = 'chats'

const chats = ref<Chat[]>([])
const currentChatId = ref<string | null>(null)
const currentSessionId = ref<string>(crypto.randomUUID())

const { userName } = useUser()

function nowTime(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function salvar(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.value))
}

function carregar(): void {
  const data = localStorage.getItem(STORAGE_KEY)
  chats.value = data ? JSON.parse(data) : []
}

const currentChat = computed<Chat | undefined>(() =>
  chats.value.find(c => c.id === currentChatId.value)
)

function criarChat(): void {
  const chat: Chat = { id: Date.now().toString(), mensagens: [] }
  chats.value.push(chat)
  currentChatId.value = chat.id
  currentSessionId.value = crypto.randomUUID()
  salvar()
}

function addMessage(role: 'user' | 'bot', text: string, meta?: string): void {
  const chat = currentChat.value
  if (!chat) return
  chat.mensagens.push({ role, text, meta: meta ?? nowTime() })
  salvar()
}

function addTyping(): string {
  const id = 'typing_' + Math.random().toString(16).slice(2)
  const chat = currentChat.value
  if (!chat) return id
  chat.mensagens.push({ role: 'bot', text: '__TYPING__', id, meta: 'digitando…' })
  return id
}

function removeTyping(id: string): void {
  const chat = currentChat.value
  if (!chat) return
  chat.mensagens = chat.mensagens.filter(m => m.id !== id)
}

function ensureIntro(): void {
  const chat = currentChat.value
  if (!chat) return
  if (chat.mensagens.length === 0) {
    chat.mensagens.push({ role: 'bot', text: INTRO_TEXT, meta: nowTime() })
  }
}

async function sendMessage(text: string): Promise<void> {
  if (!text.trim()) return

  addMessage('user', text)
  const typingId = addTyping()

  try {
    const chat = currentChat.value
    if (!chat) return

    const messages: { role: string; content: string }[] = chat.mensagens
      .filter(m => m.text !== '__TYPING__')
      .map(m => ({
        role: m.role === 'bot' ? 'assistant' : m.role,
        content: m.text,
      }))

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: MODEL,
        userId: userName.value ?? 'anonimo',
        sessionId: currentSessionId.value,
      }),
    })

    let data: { answer?: string; error?: string | { message?: string } }

    try {
      data = await res.json()
    } catch {
      const rawText = await res.text()
      throw new Error(rawText)
    }

    removeTyping(typingId)

    if (!res.ok || data.error) {
      let errorMessage = 'Erro desconhecido.'
      if (typeof data.error === 'string') errorMessage = data.error
      if (typeof data.error === 'object' && data.error?.message) errorMessage = data.error.message
      if (errorMessage.includes('Request too large')) {
        errorMessage = '⚠️ Sua conversa ficou muito longa.\n\n👉 Tente clicar em **Nova conversa** ou envie uma pergunta menor.'
      }
      addMessage('bot', `❌ Erro:\n${errorMessage}`)
      return
    }

    addMessage('bot', data.answer ?? 'Sem resposta.')
  } catch (err) {
    removeTyping(typingId)
    const msg = err instanceof Error ? err.message : String(err)
    addMessage('bot', `❌ Erro inesperado:\n${msg}`)
  }
}

export function useChat() {
  return {
    chats,
    currentChat,
    currentChatId,
    carregar,
    criarChat,
    addMessage,
    ensureIntro,
    sendMessage,
  }
}

export type { Mensagem, Chat }

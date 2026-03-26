<template>
  <Teleport to="body">
    <div class="overlay">
      <div class="modal">
        <div class="modal-logo">Φ</div>
        <h1>Monitor de Física</h1>
        <p>Para começar, digite seu nome abaixo.</p>

        <div class="field">
          <input
            ref="inputRef"
            v-model="name"
            type="text"
            placeholder="Seu nome..."
            maxlength="40"
            @keydown.enter="confirm"
          />
          <span v-if="error" class="error">{{ error }}</span>
        </div>

        <button class="btn" :disabled="!name.trim()" @click="confirm">
          Entrar no chat →
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ confirm: [name: string] }>()

const name = ref('')
const error = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => inputRef.value?.focus())

function confirm(): void {
  if (!name.value.trim()) {
    error.value = 'Por favor, digite seu nome.'
    return
  }
  emit('confirm', name.value.trim())
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal {
  background: #0f172a;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: pop .2s ease;
}

@keyframes pop {
  from { transform: scale(.95); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.modal-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  display: grid;
  place-items: center;
  font-size: 24px;
  color: var(--accent);
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 18px;
  color: var(--text);
}

p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(17, 28, 51, 0.6);
  color: var(--text);
  font-size: 14px;
  outline: none;
  font-family: var(--font);
  transition: border-color .15s, box-shadow .15s;
  box-sizing: border-box;
}

input:focus {
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.error {
  font-size: 12px;
  color: var(--danger);
}

.btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s, transform .1s;
  font-family: var(--font);
}

.btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.3);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>

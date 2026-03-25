<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="brand">
      <div class="logo">Φ</div>
      <div>
        <h1>Monitor de Física — Protótipo</h1>
        <p>Assistente para alunos do Ensino Médio</p>
      </div>
    </div>

    <div class="pill">
      <span class="dot" />
      Modo de teste (educação)
    </div>

    <!-- Warning -->
    <div class="card warn">
      <h2>Aviso importante</h2>
      <p>Esta é uma <b>aplicação de teste</b>. As respostas podem conter erros. Use para estudar, revisar e tirar dúvidas, mas confirme com o professor/material didático.</p>
    </div>

    <!-- How to use -->
    <div class="card">
      <h2>Como usar</h2>
      <p>Pergunte como se estivesse conversando com um monitor. Você pode pedir: passo a passo, fórmulas, exemplos numéricos e revisão de conceitos.</p>
      <div class="examples">
        <button
          v-for="ex in EXAMPLES"
          :key="ex.titulo"
          class="example"
          @click="emit('selectExample', ex.query)"
        >
          {{ ex.titulo }}
          <span>{{ ex.subtitulo }}</span>
        </button>
      </div>
    </div>

    <button class="btn secondary" @click="emit('newChat')">↻ Nova conversa</button>
  </aside>
</template>

<script setup lang="ts">
import { EXAMPLES } from '../types'

const emit = defineEmits<{
  newChat: []
  selectExample: [query: string]
}>()
</script>

<style scoped>
.sidebar {
  width: 320px;
  border-right: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(15,23,42,.85), rgba(15,23,42,.65));
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(17,28,51,.6);
  box-shadow: var(--shadow);
}
.logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(34,197,94,.18);
  border: 1px solid rgba(34,197,94,.25);
  display: grid;
  place-items: center;
  color: var(--accent);
  font-weight: 800;
  letter-spacing: .5px;
  flex: 0 0 auto;
}
.brand h1 { font-size: 14px; margin: 0; line-height: 1.2; }
.brand p  { margin: 2px 0 0; font-size: 12px; color: var(--muted); }

.pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: var(--muted);
  border: 1px solid var(--border);
  background: rgba(17,28,51,.35);
  padding: 8px 10px;
  border-radius: 999px;
  width: fit-content;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(34,197,94,.12);
  flex: 0 0 auto;
}

.card {
  border: 1px solid var(--border);
  background: rgba(17,28,51,.45);
  border-radius: var(--radius);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card h2 { margin: 0; font-size: 13px; letter-spacing: .2px; }
.card p  { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.45; }
.warn { border-left: 3px solid var(--danger); padding-left: 10px; }

.examples { display: flex; flex-direction: column; gap: 8px; }
.example {
  width: 100%;
  text-align: left;
  border: 1px solid var(--border);
  background: rgba(17,28,51,.35);
  color: var(--text);
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12.5px;
  line-height: 1.3;
  transition: background .15s;
}
.example:hover { background: rgba(34,197,94,.08); }
.example span { display: block; color: var(--muted); font-size: 11px; margin-top: 6px; }

.btn {
  border: 1px solid var(--border);
  background: rgba(34,197,94,.12);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: .15s transform, .15s opacity;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0); opacity: .9; }
.btn.secondary { background: rgba(17,28,51,.35); }

@media (max-width: 900px) {
  .sidebar { display: none; }
}
</style>

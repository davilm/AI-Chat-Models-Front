export interface Mensagem {
  id?: string
  role: 'user' | 'bot'
  text: string
  meta: string
}

export interface Chat {
  id: string
  mensagens: Mensagem[]
}

export const EXAMPLES = [
  {
    titulo: 'Leis de Newton',
    subtitulo: 'Pedir explicação + exemplo',
    query: 'Explique as Leis de Newton com um exemplo do dia a dia.',
  },
  {
    titulo: '2ª Lei (F = m·a)',
    subtitulo: 'Resolver questão simples',
    query: 'Resolva: um corpo de 2 kg recebe uma força de 10 N. Qual a aceleração?',
  },
  {
    titulo: 'Trabalho/Energia/Potência',
    subtitulo: 'Conceitos e diferenças',
    query: 'Qual a diferença entre trabalho, energia e potência?',
  },
  {
    titulo: 'Cinemática (MUV)',
    subtitulo: 'Explicação + exercício',
    query: 'Explique movimento uniformemente variado (MUV) e resolva um exemplo com v0, a e t.',
  },
]

export const INTRO_TEXT = `👋 Olá! Eu sou um **Monitor de Física** (protótipo).

✅ Posso te ajudar a:
- Entender conceitos (cinemática, dinâmica, energia, eletricidade…)
- Resolver exercícios passo a passo
- Revisar fórmulas e fazer exemplos numéricos

⚠️ **Importante:** isso é um MODELO DE TESTE. Posso errar.
Se quiser, diga seu assunto e o que você já sabe.`

export const API_URL = import.meta.env.VITE_API_URL as string
export const MODEL = 'openai/gpt-oss-120b'

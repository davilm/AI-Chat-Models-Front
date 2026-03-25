import { marked } from 'marked'
import katex from 'katex'
import hljs from 'highlight.js'

interface MathEntry {
  key: string
  inner: string
  display: boolean
}

function extractMath(text: string): { text: string; store: MathEntry[] } {
  const store: MathEntry[] = []

  function save(inner: string, display: boolean): string {
    const idx = store.length
    const key = btoa('M' + idx).replace(/=/g, '')
    store.push({ key, inner, display })
    return `KATEX${key}XETAK`
  }

  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, m: string) => save(m, true))
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, m: string) => save(m, true))
  text = text.replace(/\\\([\s\S]+?\\\)/g, (full: string) => save(full.slice(2, -2), false))

  const LOOKS_LIKE_LATEX = /\\[a-zA-Z]|[\^_]/
  const SPACING_RE = /\\\[[^\]]*\]/g
  const lines = text.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (/^[ \t]*\[/.test(line)) {
      const block = [line]
      let j = i
      let found = false
      let unclosed = false
      const stripped0 = line.replace(SPACING_RE, '')
      const o0 = (stripped0.match(/\[/g) || []).length
      const c0 = (stripped0.match(/\]/g) || []).length

      if (o0 > 0 && c0 >= o0) {
        found = true
      } else {
        j = i + 1
        const limit = Math.min(lines.length, i + 20)
        while (j < limit) {
          block.push(lines[j])
          const joined = block.join('\n').replace(SPACING_RE, '')
          const o = (joined.match(/\[/g) || []).length
          const c = (joined.match(/\]/g) || []).length
          if (o > 0 && c >= o) { found = true; break }
          if (j + 1 < lines.length && /^\s*$/.test(lines[j + 1])) { unclosed = true; break }
          j++
        }
        if (!found && !unclosed) unclosed = true
      }

      const full = block.join('\n')
      let inner: string | undefined

      if (found) {
        inner = full.replace(/^[ \t]*\[/, '').replace(/\][ \t]*$/, '')
      } else if (unclosed) {
        inner = full.replace(/^[ \t]*\[/, '')
      }

      if (inner !== undefined && LOOKS_LIKE_LATEX.test(inner)) {
        out.push(save(inner, true))
        i = j + 1
        continue
      }
    }
    out.push(line)
    i++
  }

  text = out.join('\n')
  text = text.replace(/(?<!\$)\$([^\n$]+?)\$(?!\$)/g, (_, m: string) => save(m, false))

  return { text, store }
}

function wrapNakedMathInTable(text: string): string {
  return text.split('\n').map(line => {
    if (!line.includes('|')) return line
    const cells = line.split('|')
    return cells.map((cell, idx) => {
      if (idx === 0 || idx === cells.length - 1) return cell
      if (/\$|\\\(|\\\[|KATEX/.test(cell)) return cell
      if (/\\[a-zA-Z]/.test(cell)) return ` $${cell.trim()}$ `
      return cell
    }).join('|')
  }).join('\n')
}

export function renderMarkdown(rawText: string): string {
  const { text: extracted, store } = extractMath(wrapNakedMathInTable(rawText))
  let html = marked.parse(extracted) as string

  for (const { key, inner, display } of store) {
    const placeholder = `KATEX${key}XETAK`
    let rendered: string
    try {
      rendered = katex.renderToString(inner.trim(), {
        displayMode: display,
        throwOnError: false,
        output: 'html',
      })
      if (display) {
        rendered = `<span style="display:block;overflow-x:auto;padding:4px 0">${rendered}</span>`
      }
    } catch {
      rendered = display ? `\\[${inner}\\]` : `\\(${inner}\\)`
    }
    html = html.split(placeholder).join(rendered)
  }

  return html
}

export function highlightCode(el: HTMLElement): void {
  el.querySelectorAll<HTMLElement>('pre code').forEach(block => {
    hljs.highlightElement(block)
  })
}

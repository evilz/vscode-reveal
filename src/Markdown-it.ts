import attrs from 'markdown-it-attrs'
import md from 'markdown-it'
import blockEmbed from 'markdown-it-block-embed'
import multimdTable from 'markdown-it-multimd-table'
import taskLists from 'markdown-it-task-lists'
import markdownDiv from 'markdown-it-div'
import markdownIframe from 'markdown-it-iframe'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItAttribution from 'markdown-it-attribution'
import markdownItDeflist from 'markdown-it-deflist'
import fontawesome from 'markdown-it-fontawesome'
import ins from 'markdown-it-ins'
import kbd from 'markdown-it-kbd'
import mark from 'markdown-it-mark'
import samp from 'markdown-it-samp'
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import {notesSeparator} from './utils'

import pako from 'pako'

const DEFAULT_DIAGRAM_SERVER = 'https://kroki.io'

interface IDiagramRenderingConfig {
  enabled: boolean
  serverBaseUrl: string
}

const diagramRenderingConfig: IDiagramRenderingConfig = {
  enabled: true,
  serverBaseUrl: DEFAULT_DIAGRAM_SERVER,
}

export const setDiagramRenderingConfig = (config: Partial<IDiagramRenderingConfig>) => {
  if (typeof config.enabled === 'boolean') {
    diagramRenderingConfig.enabled = config.enabled
  }

  if (typeof config.serverBaseUrl === 'string') {
    const trimmedServerBaseUrl = config.serverBaseUrl.trim().replace(/\/$/, '')
    diagramRenderingConfig.serverBaseUrl = trimmedServerBaseUrl || DEFAULT_DIAGRAM_SERVER
  }
}

const note = (markdown, config) => {
  const notesSeparator = config.notesSeparator
  const notesClass = 'notes'
  // Remember old renderer, if overridden, or proxy to default renderer
  // tslint:disable-next-line: only-arrow-functions
  const defaultRender =
    markdown.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  // tslint:disable-next-line: only-arrow-functions
  markdown.renderer.rules.paragraph_open = function (tokens: any[], idx, options, env, self) {
    const inlineToken = tokens[idx + 1] // text
    if (inlineToken.content.startsWith(notesSeparator)) {
      tokens[idx].tag = 'aside'
      const classIndex = tokens[idx].attrIndex('class')

      if (classIndex < 0) {
        tokens[idx].attrPush(['class', notesClass]) // add new attribute
      } else {
        tokens[idx].attrs[classIndex][1] = notesClass // replace value of existing attr
      }

      // remote "note:" from content
      tokens[idx + 1].content = inlineToken.content.replace(notesSeparator, '')
      tokens[idx + 1].children[0].content = tokens[idx + 1].children[0].content.replace(notesSeparator, '')

      tokens[idx + 2].tag = 'aside'
    }
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}


const diagramTypes = [
  'blockdiag',
  'bpmn',
  'bytefield',
  'seqdiag',
  'actdiag',
  'nwdiag',
  'packetdiag',
  'rackdiag',
  'ditaa',
  'erd',
  'excalidraw',
  'graphviz',
  'mermaid',
  'nomnoml',
  'pikchr',
  'plantuml',
  'svgbob',
  'umlet',
  'vega',
  'vega-lite',
  'wavedrom',
]


const markdown = md({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(multimdTable, { enableMultilineRows: true, enableRowspan: true })
    .use(attrs)
    .use(attrs, { leftDelimiter: '<!-- .element:', rightDelimiter: '-->' })
    .use(taskLists, { label: true, labelAfter: true })
    .use(markdownIframe)
    .use(blockEmbed)
    .use(markdownDiv)
    .use(markdownItAbbr)
    .use(markdownItAttribution)
    .use(markdownItDeflist)
    .use(fontawesome)
    .use(ins)
    .use(kbd)
    .use(mark)
    .use(samp)
    .use(sub)
    .use(sup)
    .use(note, { notesSeparator })

// add kroki
  const highlight = markdown.options.highlight
  markdown.options.highlight = (code, lang, attr) => {
    if (lang && diagramTypes.indexOf(lang.toLowerCase()) >= 0) {
      if (!diagramRenderingConfig.enabled) {
        return `<pre><code class="language-${lang.toLowerCase()}">${markdown.utils.escapeHtml(code)}</code></pre>`
      }

      const data = Buffer.from(code, 'utf8')
      const compressed = pako.deflate(data, { level: 9 })
      const result = Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
      return `<pre style="all:unset;"><div><img class="${lang.toLowerCase()}" src="${diagramRenderingConfig.serverBaseUrl}/${lang.toLowerCase()}/svg/${result}" /></div></pre>`
    }
    if (highlight !== null && highlight !== undefined) {
      return highlight(code, lang, attr)
    }

    return ''
  }

export default markdown

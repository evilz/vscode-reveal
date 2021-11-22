import attrs from 'markdown-it-attrs'
import md from 'markdown-it'
import blockEmbed from 'markdown-it-block-embed'
import container from 'markdown-it-container'
import multimdTable from 'markdown-it-multimd-table'
import taskLists from 'markdown-it-task-lists'
import containerPandoc from 'markdown-it-container-pandoc'
import markdownPlayground from 'markdown-it-playground'
import markdownDiv from 'markdown-it-div'
import markdownIframe from 'markdown-it-iframe'
import { Configuration } from './Configuration'

import pako from 'pako'

import encoder from 'plantuml-encoder'

// const note = regex(
//     // regexp to match
//     ///Note:(.+)/gm,
//     /[nN]ote:(.+)/gs,

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

const preProcess = (/** @type {string} */ source) => source.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const mermaidContainer = () => {
  const pluginKeyword = 'mermaid'
  const tokenTypeInline = 'inline'
  const ttContainerOpen = 'container_' + pluginKeyword + '_open'
  const ttContainerClose = 'container_' + pluginKeyword + '_close'
  const empty = []
  return {
    marker: '`',
    anyClass: true,
    validate: (info) => {
      return info.trim() === pluginKeyword
    },

    render: (tokens, idx) => {
      const token = tokens[idx]

      let src = ''
      if (token.type === ttContainerOpen) {
        for (let i = idx + 1; i < tokens.length; i++) {
          const value = tokens[i]
          if (value === undefined || value.type === ttContainerClose) {
            break
          }
          src += value.content
          if (value.block && value.nesting <= 0) {
            src += '\n'
          }
          // Clear these out so markdown-it doesn't try to render them
          value.tag = ''
          value.type = tokenTypeInline
          value.content = ''
          value.children = empty
        }
      }

      if (token.nesting === 1) {
        return `<div data="coucou" class="${pluginKeyword}">${preProcess(src)}`
      } else {
        return '</div>'
      }
    },
  }
}

const plantUmlContainer = () => {
  const pluginKeyword = 'plantuml'
  const tokenTypeInline = 'inline'
  const ttContainerOpen = 'container_' + pluginKeyword + '_open'
  const ttContainerClose = 'container_' + pluginKeyword + '_close'
  const empty = []
  const server = '//www.plantuml.com/plantuml/svg/' //TODO config.serverPath || '//www.plantuml.com/plantuml/svg/';
  return {
    marker: '`',
    anyClass: true,
    validate: (info) => {
      return info.trim() === pluginKeyword
    },

    render: (tokens, idx) => {
      const token = tokens[idx]

      let src = ''
      if (token.type === ttContainerOpen) {
        for (let i = idx + 1; i < tokens.length; i++) {
          const value = tokens[i]
          if (value === undefined || value.type === ttContainerClose) {
            break
          }
          src += value.content
          if (value.block && value.nesting <= 0) {
            src += '\n'
          }
          // Clear these out so markdown-it doesn't try to render them
          value.tag = ''
          value.type = tokenTypeInline
          value.content = ''
          value.children = empty
        }
      }

      if (token.nesting === 1) {
        return `<img class="${pluginKeyword}" src="${server}${encoder.encode(src)}" />`
      } else {
        return ''
      }
    },
  }
}

const twitterService = {
  name: 'twitter',
  option: {},
  env: {},
}

const krokiContainer = () => {
  const pluginKeyword = 'kroki'
  const tokenTypeInline = 'inline'
  const ttContainerOpen = 'container_' + pluginKeyword + '_open'
  const ttContainerClose = 'container_' + pluginKeyword + '_close'
  const empty = []
  const server = 'https://kroki.io' //TODO config.serverPath || '//www.plantuml.com/plantuml/svg/';
  let diagramsType = ''
  return {
    marker: '`',
    anyClass: true,
    validate: (info: string) => {
      const isValid = info.indexOf(pluginKeyword) == 0
      diagramsType = info.replace(pluginKeyword, '').trim()
      return isValid
    },

    render: (tokens, idx) => {
      const token = tokens[idx]

      let src = ''
      if (token.type === ttContainerOpen) {
        for (let i = idx + 1; i < tokens.length; i++) {
          const value = tokens[i]
          if (value === undefined || value.type === ttContainerClose) {
            break
          }
          src += value.content
          if (value.block && value.nesting <= 0) {
            src += '\n'
          }
          // Clear these out so markdown-it doesn't try to render them
          value.tag = ''
          value.type = tokenTypeInline
          value.content = ''
          value.children = empty
        }
      }

      if (token.nesting === 1) {
        const data = Buffer.from(src, 'utf8')
        const compressed = pako.deflate(data, { level: 9 })
        const result = Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
        return `<img class="${pluginKeyword}" src="${server}/${diagramsType}/svg/${result}" />`
      } else {
        return ''
      }
    },
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

// const rStackContainer = () => ({
//   validate: function (params) {
//     return params.trim().match(/^r-stack\s+(.*)$/)
//   },

//   render: function (tokens, idx) {
//     return md.renderInline(tokens)
//   },
// })

export default (config: Configuration) => {
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
    .use(markdownPlayground)
    //.use(container, 'block')
    //.use(containerPandoc)
    .use(markdownDiv)
    //.use(textualUml)
    .use(note, { notesSeparator: config.notesSeparator })

  const highlight = markdown.options.highlight
  //markdown.options.langPrefix = ''
  markdown.options.highlight = (code, lang, attr) => {
    const server = 'https://kroki.io' //TODO config.serverPath || '//www.plantuml.com/plantuml/svg/';

    if (lang && diagramTypes.indexOf(lang.toLowerCase()) >= 0) {
      const data = Buffer.from(code, 'utf8')
      const compressed = pako.deflate(data, { level: 9 })
      const result = Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
      return `<pre style="all:unset;"><div><img class="${lang}" src="${server}/${lang}/svg/${result}" /></div></pre>`
    }
    if (highlight !== null && highlight !== undefined) {
      return highlight(code, lang, attr)
    }

    return ''
  }
  return markdown
}

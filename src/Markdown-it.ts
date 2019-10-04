import * as attrs from '@evilz/markdown-it-attrs'
import * as md from 'markdown-it'
import * as blockEmbed from 'markdown-it-block-embed'
import * as container from 'markdown-it-container'
import * as githubHeadings from 'markdown-it-github-headings'
import * as imsize from 'markdown-it-imsize'
import * as multimdTable from 'markdown-it-multimd-table'
import * as taskLists from 'markdown-it-task-lists'
import { Configuration } from './Configuration'


// const note = regex(
//     // regexp to match
//     ///Note:(.+)/gm,
//     /[nN]ote:(.+)/gs,

const note = (markdown, config ) => {
    const notesSeparator = config.notesSeparator
    const notesClass = "notes"
    // Remember old renderer, if overridden, or proxy to default renderer
    // tslint:disable-next-line: only-arrow-functions
    const defaultRender = markdown.renderer.rules.paragraph_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  
    // tslint:disable-next-line: only-arrow-functions
    markdown.renderer.rules.paragraph_open = function (tokens: any[], idx, options, env, self) {
      const inlineToken = tokens[idx + 1] // text
      if (inlineToken.content.startsWith(notesSeparator)) {
        tokens[idx].tag = "aside"
        const classIndex = tokens[idx].attrIndex('class');
  
        if (classIndex < 0) {
          tokens[idx].attrPush(['class', notesClass]); // add new attribute
        } else {
          tokens[idx].attrs[classIndex][1] = notesClass;    // replace value of existing attr
        }
  
        // remote "note:" from content
        tokens[idx + 1].content = inlineToken.content.replace(notesSeparator, '')
        tokens[idx + 1].children[0].content = tokens[idx + 1].children[0].content.replace(notesSeparator, '')
  
        tokens[idx + 2].tag = "aside"
      }
      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self);
    };
  }

export default (config:Configuration) => {
    return md({
    html: true,
    linkify: true,
    typographer: true
})
    .use(multimdTable, { enableMultilineRows: true, enableRowspan: true })
    .use(attrs)
    .use(attrs, { leftDelimiter: '<!-- .element:', rightDelimiter: '-->',})
    .use(imsize)
    .use(taskLists, { label: true, labelAfter: true })
    .use(blockEmbed)
    .use(githubHeadings,{enableHeadingLinkIcons:false})
    .use(container, 'block')
    .use(note, {notesSeparator: config.notesSeparator})
}



import * as attrs from '@evilz/markdown-it-attrs'
import * as blockEmbed from 'markdown-it-block-embed'
import * as container from 'markdown-it-container'
import * as githubHeadings from 'markdown-it-github-headings'
import * as imsize from 'markdown-it-imsize'
import * as multimdTable from 'markdown-it-multimd-table'
import * as taskLists from 'markdown-it-task-lists'

import * as md from 'markdown-it'


export default md({
    html: true,
    linkify: true,
    typographer: true
})
    .use(multimdTable, { enableMultilineRows: true, enableRowspan: true })
    .use(attrs)
    .use(imsize)
    .use(taskLists, { label: true, labelAfter: true })
    .use(blockEmbed)
    .use(githubHeadings,{enableHeadingLinkIcons:false})
    .use(container, 'block');
// .use(require('markdown-it-span'));

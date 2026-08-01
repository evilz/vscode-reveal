import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

const isDevServer = process.argv.includes('dev') || process.env.DOCS_DEV === 'true'

export default defineConfig({
  title: 'VS Code Reveal',
  description: 'Create Reveal.js presentations in Markdown from Visual Studio Code.',
  base: isDevServer ? '/' : '/vscode-reveal/',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/assets/images/logo-v2-small.png' }]],
  themeConfig: {
    logo: '/assets/images/logo-v2-small.png',
    siteTitle: 'VS Code Reveal',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/evilz/vscode-reveal' }],
    nav: [
      { text: 'Documentation', link: '/guide/quick-start' },
      { text: 'Examples', link: '/features/examples' },
      { text: 'Reference', link: '/reference/configuration' },
      { text: 'Changelog', link: 'https://github.com/evilz/vscode-reveal/blob/master/CHANGELOG.md' },
    ],
    sidebar: {
      '/': [
        { text: 'Start here', items: [{ text: 'Quick start', link: '/guide/quick-start' }, { text: 'How it works', link: '/guide/how-it-works' }] },
        { text: 'Build a presentation', items: [{ text: 'Markdown basics', link: '/markdown/basic-syntax' }, { text: 'Extended syntax', link: '/markdown/extended-syntax' }, { text: 'Export and share', link: '/guide/export' }] },
        { text: 'Feature cookbook', items: [{ text: 'Overview', link: '/features/' }, { text: 'Live examples', link: '/features/examples' }, { text: 'Themes and transitions', link: '/features/themes' }, { text: 'Fragments and animations', link: '/features/fragments' }, { text: 'Diagrams, math, and code', link: '/features/content' }, { text: 'Navigation and presenter tools', link: '/features/navigation' }] },
        { text: 'Configuration reference', items: [{ text: 'All revealjs.* settings', link: '/reference/configuration' }, { text: 'Front matter', link: '/reference/front-matter' }] },
        { text: 'Project', items: [{ text: 'Releasing', link: '/releasing' }, { text: 'Contributing', link: 'https://github.com/evilz/vscode-reveal/blob/master/CONTRIBUTING.md' }, { text: 'Reveal.js reference', link: 'https://revealjs.com/' }] },
      ],
    },
    footer: { message: 'MIT Licensed', copyright: 'Copyright © 2018-present Vincent Bourdon' },
  },
  vite: { resolve: { alias: { '@docs': fileURLToPath(new URL('.', import.meta.url)) } } },
})

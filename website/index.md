---
layout: home
hero:
  name: VS Code Reveal
  text: Present from Markdown
  tagline: Build, preview, and export polished Reveal.js presentations without leaving Visual Studio Code.
  image:
    src: /assets/images/logo-v2.png
    alt: VS Code Reveal logo
  actions:
    - theme: brand
      text: Install the extension
      link: https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal
    - theme: alt
      text: Start the guide
      link: /guide/quick-start
features:
  - icon: ⚡
    title: Live preview
    details: Edit Markdown and see your slides refresh alongside your document.
    link: /guide/how-it-works
  - icon: ✨
    title: Powerful slide syntax
    details: Use fragments, diagrams, math, code highlighting, themes, and more.
    link: /features/
  - icon: 📦
    title: Export when ready
    details: Share a PDF or a static HTML presentation from the same source.
    link: /guide/export
---

## See it in action

<div class="home-preview">
  <iframe src="./examples/hello/index.html" title="Live Reveal.js presentation example" loading="lazy"></iframe>
  <p><a href="./features/examples">Explore the complete example gallery →</a></p>
</div>

## The fastest path to your first deck

1. Install **VS Code Reveal** from the Marketplace.
2. Create a Markdown file with two or more slides.
3. Open the preview from the editor title bar or the slide counter.

```markdown
---
theme: black
title: My first deck
---

# Hello, Reveal.js

Build presentations with the tools you already use.

---

## A slide is just Markdown

- Edit the source
- Preview instantly
- Export when you are ready
```

<div class="home-cta"><a class="VPButton medium brand" href="./guide/quick-start">Read the quick start</a></div>

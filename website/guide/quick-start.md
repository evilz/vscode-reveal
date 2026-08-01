# Quick start

Go from an empty Markdown file to a live presentation in under a minute.

## 1. Install the extension

Install [VS Code Reveal from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal), then reload VS Code if prompted.

## 2. Create a presentation

Create `presentation.md` and add two slides separated by `---`:

```markdown
---
title: My presentation
theme: black
---

# Welcome

This is the first slide.

---

## The second slide

Write your slides in Markdown and keep your source in version control.
```

## 3. Open the preview

When the document contains at least two slides, VS Code Reveal shows a slide counter in the status bar. Select it, or use **Revealjs: Show presentation by side** from the Command Palette.

![Slide counter in VS Code](/assets/images/one-slide.png)

The preview runs on a local server and refreshes as you edit.

## 4. Add real content

Continue with [Markdown basics](/markdown/basic-syntax), then browse the [feature examples](/features/examples).

## Troubleshooting

- If the preview does not appear, save the Markdown file and check that it contains at least two slides.
- If a browser does not open, use the side-by-side preview command first; it exposes the local server address.
- If a feature behaves differently than expected, check the [configuration reference](/reference/configuration) and the relevant example.

# Fragments and animations

Fragments reveal content step by step. VS Code Reveal supports the attribute syntax without requiring raw HTML:

```markdown
- Establish the idea {.fragment}
- Add emphasis {.fragment .highlight-red}
- Reveal this last {.fragment data-fragment-index="2"}

Move this paragraph later {.fragment .fade-up}
```

Set `revealjs.incremental` to `true` to reveal list items one at a time by default.

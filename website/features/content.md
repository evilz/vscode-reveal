# Diagrams, math, and code

## Code

Use fenced code blocks for syntax highlighting:

```ts
const presentation = await reveal.start()
```

## Math

MathJax expressions can be used in Markdown when the relevant Reveal.js math support is available:

```markdown
$$E = mc^2$$
```

## Diagrams

Diagram rendering can use the configured Kroki-compatible server. Set `revealjs.diagramServerEnabled` to `false` for offline operation, or configure `revealjs.diagramServerUrl` for a compatible endpoint.

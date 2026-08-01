# Use VitePress source with generated master:/docs output

The documentation site uses VitePress for modern static rendering while GitHub Pages continues to publish from `master:/docs`. Authored Markdown and examples live in `website/`; CI builds the site and commits the generated output into `docs/`, preserving the existing Pages configuration and custom-domain path without relying on the ignored `gh-pages` branch.

## Considered options

- Keep Docsify: rejected because runtime CDN rendering and hand-maintained navigation make the site harder to validate and evolve.
- Publish through a separate `gh-pages` deployment branch: rejected because the repository already uses `master:/docs` as its publication contract.

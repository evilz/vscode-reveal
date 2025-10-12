# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Updated dependencies to latest compatible versions
  - Express 5.0.1 → 5.1.0
  - markdown-it-attrs 4.2.0 → 4.3.1
  - morgan 1.10.0 → 1.10.1
  - open 8.4.0 → 8.4.2
  - prettier 3.3.3 → 3.6.2
  - @types/vscode 1.95.0 → 1.105.0
  - eslint 8.18.0 → 8.57.1
  - esbuild 0.24.0 → 0.24.2
  - supertest 7.0.0 → 7.1.4
  - And several other development dependencies

### Fixed
- Updated SlideExplorer icon paths to use vscode.Uri.file() for compatibility with @types/vscode 1.105.0

### Added
- Comprehensive unit tests for updated dependencies (12 new tests)
- Tests verify functionality of Express, EJS, Markdown-it, and other core dependencies

## 4.3.3

- fix EJS issue with minification
## 4.3.2

- Use ExpressJS 5 and EJS
- Split EJS views
- Add new themes :  cern, hull-blue, material, myplanet, object-partners, pikestreet, puzzle, robot-lung-ebi, robot-lung, savasian, sfeir-school, sunblind, tidy
- Add slide borders
- Add cssvariables
- Add init override using init.js file

## 4.3.1

- Update Revealjs to 4.3.1
- Add plugin Verticor
- Dependencies update
- Add new Config for list of custom CSS
- fix config for Width and height for string like 100%
- Integrated Grid css (https://korywakefield.com/iota/)
- Add new snippets for Slide and Fragments

## 4.1.3

- Cannot Switch Between Different Markdown File Freely [858](https://github.com/evilz/vscode-reveal/issues/858)
- Custom themes applying inconsistently [852](https://github.com/evilz/vscode-reveal/issues/852)
- Error loading images [851](https://github.com/evilz/vscode-reveal/issues/851)

## 4.1.2

- Add Anything plugin [830](https://github.com/evilz/vscode-reveal/issues/830)
- Change snippets too `sld-*` [815](https://github.com/evilz/vscode-reveal/issues/815)
- Fix: can't open presentation in browser [801](https://github.com/evilz/vscode-reveal/issues/801)
- Fix: exported presentation links [799](https://github.com/evilz/vscode-reveal/issues/799)
- Add back coinfig of separator [740](https://github.com/evilz/vscode-reveal/issues/740)

## 4.1.1

- Add config for presentation size [741](https://github.com/evilz/vscode-reveal/issues/741)
- Fix embeded sample issue
- update npm dependencies

## 4.1.0

- update Reveal.js to 4.1.3
- a lot of markdown feature add
- Samples
- kroki support
- Frontmatter completion and decoration with documentation

## 4.0.3

### Fix

- Static export now include presenter mode
- Common `note:` markdown separator fix
- `element` comment now parsed

## 4.0.2

### Fix

- Change static file middleware

## 4.0.1

### Fix

- Fix with @evilz/markdown-it-attrs

## 4.0.0

- Use webpack to bundle extension
- Change internal server from `express js` to `koa`
- Use `markdown-it` with extension to parse markdown
- Html now contain final html, so you don't need a server after exporting your presentation
- Fix navigation from left treeview in vs code
- use jest for unit test
- Update to reveal 3.8
- Fix export

- Features & Plugins
  - Can create div
  - Can set attributs to element
  - Mermaid
  - Embed video like Youtube, Vimeo,Vine, Prezi
  - Support Task list
  - Support merged cell in table
  - Touch Optimized
  - Fragments with style
  - Themes and custom themes
  - Pretty Code with code focus
  - Speaker view with notes
  - Export to PDF
  - Export to HTML 
  - Search text in slides
  - Zoom
  - Chalkboard
  - Note on slide
  - Chart from json
  - Embeded Tweet
  - Menu
  - Custom Icon
  - Math SVG
  
## 3.4.0

Fix issues :
- Export html with no content in file
- Default searators
- Update dependencies
- Add settings to disable some plugin

## 2.0.3

Fix issues :

- Export html in folder with same name of markdown file suffixed by '-export'
- Export speaker notes
- Find chrome on linux
- Can change chrome path in configuration
- Slide explorer can be hide in configuration

## 2.0.0

- New sidebar !!!!
- Pdf export
- Html export

## 1.0.0

- No me a preveiw !
- Fix issue https://github.com/evilz/vscode-reveal/issues/16  (Thank to Matt Bierner #mjbvz) 
- Fix no refresh on save

## 0.0.9

- fix Issues
    - Side by side view does not refresh
    - highlightTheme

- new feature : custom theme :)

## 0.0.8

- Front matter !

## 0.0.7

- Show current slide on save
- Can use local image in markdow 

## 0.0.6

- fix linux/mac issues due to filename :(

## 0.0.5

- fix issues
- Add command on click on status bar items

## 0.0.4

- add many settings !
- add slide count in status bar
- add server address in status bar

## 0.0.1

first release

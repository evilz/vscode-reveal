# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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

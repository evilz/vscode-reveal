# vscode-reveal [![](https://img.shields.io/visual-studio-marketplace/v/evilz.vscode-reveal)](https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal) ![install](https://img.shields.io/visual-studio-marketplace/i/evilz.vscode-reveal)


[![codecov](https://codecov.io/gh/evilz/vscode-reveal/branch/master/graph/badge.svg?token=Ff2zjHz6lR)](https://codecov.io/gh/evilz/vscode-reveal)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=evilz_vscode-reveal&metric=alert_status)](https://sonarcloud.io/dashboard?id=evilz_vscode-reveal)
<!-- 

[![Known Vulnerabilities](https://snyk.io/test/github/evilz/vscode-reveal/badge.svg?targetFile=package.json)](https://snyk.io/test/github/evilz/vscode-reveal?targetFile=package.json) -->

This extension let you display a reveal.js presentation directly from an opened markdown document.

![demo](https://github.com/evilz/vscode-reveal/raw/master/images/demo2.0-bis.gif)

> Full documentation [here](https://www.evilznet.com/vscode-reveal)

## Development platform baseline

The extension targets `engines.vscode: ^1.105.0` and keeps `@types/vscode` aligned to the same API generation.  
This baseline matches the current stable extension platform while still allowing patch/minor compatibility updates for contributors and CI.

## Features

- [Markdown](#markdown)
- [Status bar](#statusbar)
- [Sidebar and navigation](#sidebar)
- [Theme](#theme)
- [Highlight Theme](#highlight)
- [Reveal.js Options](#options)
- [YAML Front Matter](#frontmatter)
- [Open preview on right side](#preview)
- [Open in browser](#browser)
- [Print to PDF](#pdf)
- [Export static Website](#htmlexport)
- [Plugins](#plugins)
- [FAQ](#faq)

## <a id="markdown"></a> Markdown

Create reveal.js presentation directly from markdown file,
open or create a new file in markdown and use default slide separator to see slide counter change in the status bar and title appear in the sidebar.

Since Reveal.js use marked to parse the markdown string you can use this in your document:

- GitHub flavored markdown.
- GFM tables

Fragments can be authored directly in markdown with attributes (no raw HTML needed):

```md
- First point {.fragment}
- Then emphasize this {.fragment .highlight-red}
- Finally this one {.fragment data-fragment-index="2"}

Paragraph shown later {.fragment .fade-up}
```

If you need a sample file you can get it here:
https://raw.githubusercontent.com/evilz/vscode-reveal/master/sample.md


## <a id="statusbar"></a> Status bar

As soon as your markdown document has at least two slides, slides counter will appear in the status bar on right.

![](https://github.com/evilz/vscode-reveal/raw/master/images/statusbar.png)

Clicking on slide counter will launch preview on right, and you can now see the local address of express server used to host Reveal presentation.
Clicking on the address will launch presentation in the browser.

You can stop express server when you want by clicking on the red square.

## <a id="sidebar"></a> Sidebar and navigation

**Now in version 2**, you can see a list of all your slides on the sidebar.
The list will show the first line of text that is found in the slide, most of the time it will be a title, but it can also be an image or something else.

Blue icon is used to show horizontal slide, orange is used for vertical ones.

Clicking on slide name will move the cursor on beginning of the slide in the editor.
If the preview is opened it will also show the selected slide on it.

![](https://github.com/evilz/vscode-reveal/raw/master/images/sidebar.png)


## <a id="theme"></a> Theme

reveal.js comes with a few themes built in:
- black - Black background, white text, blue links (default)
- white - White background, black text, blue links
- league - Gray background, white text, blue links
- beige - Beige background, dark text, brown links
- sky - Blue background, thin dark text, blue links
- night - Black background, thick white text, orange links
- serif - Cappuccino background, gray text, brown links
- simple - White background, black text, blue links
- solarized - Cream-colored background, dark green text, blue links
- blood - Dark background, thick white text, red links
- moon - Dark blue background, thick grey text, blue link

You can set it using `revealjs.theme` parameter in Vs code config or in the document itself using front matter.

If you want a custom theme you can do it!
Just add custom style to a CSS file in the same folder that your markdown.

example:
if your file name is `my-theme.css` just add this in the front matter header :

```
---
customTheme : "my-theme"
---
```


Note that you can use both theme and custom theme at the same time. Your custom theme will be loaded after to override default reveal.js theme.

Path resolution rules for local assets and export:
- `customTheme`, `css`, `init.js`, and `init.esm.js` are resolved from the markdown document folder when the document is saved (`file:` and remote `vscode-remote:` documents).
- For unsaved `untitled:` documents, relative paths resolve from the matching workspace folder (or the first workspace folder if no direct match exists).
- For virtual/non-file documents without a workspace folder, relative local asset paths are ignored gracefully (remote URLs still work).
- `revealjs.exportHTMLPath` keeps absolute paths as-is; relative export paths resolve from the same base folder rules above.
- If a markdown file is outside the workspace, its own folder remains the resolution base to avoid cross-workspace surprises.



## <a id="highlight"></a> Highlight Theme

You can use code block in your markdown that will be highlighted by highlight.js.
So you can configure the coloration theme by setting `revealjs.highlightTheme` parameter of VS Code, or set it using front matter.

```
---
highlightTheme : "other theme"
---
```

Get the theme list here https://highlightjs.org/

## <a id="diagramserver"></a> Diagram server (Kroki)

Diagram languages supported by Kroki (for example `mermaid`, `plantuml`, `graphviz`, etc.) can be rendered remotely.

- `revealjs.diagramServerEnabled` (default: `true`) keeps current behavior and renders diagrams as images.
- `revealjs.diagramServerUrl` (default: `https://kroki.io`) lets you target your own Kroki-compatible endpoint.

For a fully local/offline mode, set:

```
diagramServerEnabled: false
```

In this mode, diagram code blocks are kept as plain code blocks and no remote diagram request is made.

## Custom initialization

Place an `init.js` file next to your markdown file to replace the default Reveal.js initialization script. If your initialization needs ECMAScript modules, use `init.esm.js` instead; it is loaded as `<script type="module">`, so it can use standard `import` statements for files served from the same folder. When both files exist, `init.esm.js` takes precedence. `init.esm.js` must be a complete custom initialization script and initialize Reveal itself, just like `init.js`.

## <a id="options"></a> Reveal.js Options


You can customize many setting on for your reveal.js presentation.

Configuration contract notes (validated by unit tests):
- Runtime-only/frontmatter options: `author`, `autoPlayMedia`, `customHighlightTheme`, `customTheme`, `defaultTiming`, `description`, `display`, `enableTitleFooter`, `fragmentInURL`, `logLevel`, `logoImg`, `notesSeparator`, `separator`, `verticalSeparator`.
- VS Code-contributed only options: `hashOneBasedIndex`, `showSlideNumber`.

<table><tr><th>Name</th><th>Description</th><th>Default</th></tr><tr><td><code>revealjs.notesSeparator</code></td><td>Revealjs markdown note delimiter</td><td><code>note:</code></td></tr><tr><td><code>revealjs.separator</code></td><td>Revealjs markdown slide separator</td><td><code>^(
?|
)---(
?|
)$</code></td></tr><tr><td><code>revealjs.verticalSeparator</code></td><td>Revealjs markdown vertical separator</td><td><code>^(
?|
)--(
?|
)$</code></td></tr>
<tr><td><code>revealjs.theme</code></td><td>Revealjs Theme (black, white, league, beige, sky, night, serif, simple, solarized</td><td><code>black</code></td></tr>
<tr><td><code>revealjs.highlightTheme</code></td><td>Highlight Theme</td><td><code>Zenburn</code></td></tr>
<tr><td><code>revealjs.diagramServerEnabled</code></td><td>Enable remote diagram rendering through a Kroki-compatible server</td><td><code>true</code></td></tr>
<tr><td><code>revealjs.diagramServerUrl</code></td><td>Base URL of the Kroki-compatible diagram server</td><td><code>https://kroki.io</code></td></tr>
<tr><td><code>revealjs.controls</code></td><td>Display controls in the bottom right corner</td><td><code>true</code></td></tr><tr><td><code>revealjs.progress</code></td><td>Display a presentation progress bar</td><td><code>true</code></td></tr><tr><td><code>revealjs.slideNumber</code></td><td>Display the page number of the current slide</td><td><code></code></td></tr><tr><td><code>revealjs.history</code></td><td>Push each slide change to the browser history</td><td><code></code></td></tr><tr><td><code>revealjs.keyboard</code></td><td>Enable keyboard shortcuts for navigation</td><td><code>true</code></td></tr><tr><td><code>revealjs.overview</code></td><td>Enable the slide overview mode</td><td><code>true</code></td></tr><tr><td><code>revealjs.center</code></td><td>Vertical centering of slides</td><td><code>true</code></td></tr><tr><td><code>revealjs.touch</code></td><td>Enables touch navigation on devices with touch input</td><td><code>true</code></td></tr><tr><td><code>revealjs.loop</code></td><td>Loop the presentation</td><td><code></code></td></tr><tr><td><code>revealjs.rtl</code></td><td>Change the presentation direction to be RTL</td><td><code></code></td></tr><tr><td><code>revealjs.shuffle</code></td><td>Randomizes the order of slides each time the presentation loads</td><td><code></code></td></tr><tr><td><code>revealjs.fragments</code></td><td>Turns fragments on and off globally</td><td><code>true</code></td></tr><tr><td><code>revealjs.embedded</code></td><td>Flags if the presentation is running in an embedded mode, i.e. contained within a limited portion of the screen</td><td><code></code></td></tr><tr><td><code>revealjs.help</code></td><td>Flags if we should show a help overlay when the questionmark key is pressed</td><td><code>true</code></td></tr><tr><td><code>revealjs.showNotes</code></td><td>Flags if speaker notes should be visible to all viewers</td><td><code></code></td></tr><tr><td><code>revealjs.autoSlide</code></td><td>Number of milliseconds between automatically proceeding to the next slide, disabled when set to 0, this value can be overwritten by using a data-autoslide attribute on your slides</td><td><code></code></td></tr><tr><td><code>revealjs.autoSlideMethod</code></td><td>The direction in which the slides will move whilst autoslide is activet</td><td><code>Reveal.navigateNext</code></td></tr><tr><td><code>revealjs.autoSlideStoppable</code></td><td>Stop auto-sliding after user input</td><td><code>true</code></td></tr><tr><td><code>revealjs.mouseWheel</code></td><td>Enable slide navigation via mouse wheel</td><td><code></code></td></tr><tr><td><code>revealjs.hideAddressBar</code></td><td>Hides the address bar on mobile devices</td><td><code>true</code></td></tr><tr><td><code>revealjs.previewLinks</code></td><td>Opens links in an iframe preview overlay</td><td><code></code></td></tr><tr><td><code>revealjs.transition</code></td><td>Transition style (none/fade/slide/convex/concave/zoom)</td><td><code>default</code></td></tr><tr><td><code>revealjs.transitionSpeed</code></td><td>Transition speed (default/fast/slow)</td><td><code>default</code></td></tr><tr><td><code>revealjs.backgroundTransition</code></td><td>Transition style for full page slide backgrounds (none/fade/slide/convex/concave/zoom)</td><td><code>default</code></td></tr><tr><td><code>revealjs.viewDistance</code></td><td>Number of slides away from the current that are visible</td><td><code>3</code></td></tr><tr><td><code>revealjs.parallaxBackgroundImage</code></td><td>Parallax background image</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundSize</code></td><td>Parallax background size (CSS syntax, e.g. 2100px 900px)</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundHorizontal</code></td><td>Number of pixels to move the parallax background per slide</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundVertical</code></td><td>Number of pixels to move the parallax background per slide</td><td><code></code></td></tr></table>


## <a id="frontmatter"></a> YAML Front Matter

You can change settings directly in your markdown file using front matter style. You can change all extention settings like this :

```
---
theme : "white"
transition: "zoom"
---
```

> Note do not add `revealjs.` prefix before setting name.


## Create a new presentation

You can scaffold a new presentation directly from built-in templates:
- run the command `Revealjs: New presentation from template`
- choose a starter template (`Minimal`, `Code-heavy`, `Speaker notes`, or `Custom theme`)
- pick where to save the `.md` file

When a template needs local assets (for example `Custom theme`), the extension creates only the required supporting files next to your presentation.

## <a id="preview"></a> Open preview on right side

To display the preview on the right side you can :
- click on slide count in status bar
- click split icon in sidebar header
- call command `Revealjs: Show presentation by side`


The preview will be synchronize with the current cursor position.

## <a id="browser"></a> Open in browser

To display presentation in the browser you can:
- click on server address in the status bar
- click the icon in sidebar header
- call command `Revealjs: Open presentation in a browser`


This uses VS Code's native external URL API by default (same behavior as opening a URL from VS Code).

If `revealjs.browserPath` is set, the extension uses that executable path to launch the presentation instead of the VS Code default external opener.

## Presenter view / speaker notes

To open a dedicated presenter workflow (speaker notes + current/upcoming slide):
- call command `Revealjs: Open presenter view in browser`
- or use `Revealjs: Open presentation in a browser`, then press `S`

How it works with the main deck preview:
- presenter view opens a browser tab for the current deck and automatically launches Reveal.js speaker view in a second popup window
- navigation stays synchronized between the deck tab and the speaker window
- speaker notes authored in markdown (`note:` / `<aside class="notes">`) are shown in the presenter window

Supported execution modes:
- ✅ external browser mode (default browser or `revealjs.browserPath`): fully supported
- ⚠️ VS Code webview side preview: does not provide a first-class presenter popup workflow


## <a id="pdf"></a> Print to PDF

To export your presentation to pdf you can:
- click on PDF icon in the sidebar
- call the command `Revealjs: Export in PDF`


This opens the print URL using the same browser resolution rules as above:
- if `revealjs.browserPath` is set and valid, that executable is used
- otherwise VS Code's native external URL API is used

PDF export uses Reveal.js print settings. Set `revealjs.pdfSeparateFragments` to `false` to keep fragments on the same exported page, set `revealjs.pdfMaxPagesPerSlide` to cap slide overflow pages, and use `revealjs.slideNumber` formats such as `h/v` when you need formatted slide numbers.

Be sure to set print setting correctly:
- No margin
- print background


## <a id="htmlexport"></a> Export static Website

To export your presentation to a static website you can:
- click on HTML icon in the sidebar
- call the command `Revealjs: Export in HTML`


The export runs in the extension host and then opens the export folder using VS Code native APIs.

Folder-open fallback behavior:
- first try `revealFileInOS` (native reveal in file manager)
- if unavailable, fallback to `vscode.env.openExternal` with a `file://` URI

## <a id="plugins"></a> Plugins

### Disable slideout menu

```
---
enableMenu: false
---
```

### Disable chalkboard

```
---
enableChalkboard: false
---
```

### Disable title footer

```
---
enableTitleFooter: false
---
```

### Disable zoom

```
---
enableZoom: false
---
```

### Disable search

```
---
enableSearch: false
---
```

## <a id="faq"></a> FAQ


> Note : The first time, Windows will ask you about the firewall. If you open the port for the application, you can see your presentation remotely.


## Known Issues

Please add issues on github.

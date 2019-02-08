# vscode-reveal [![](https://img.shields.io/badge/Version-3.2.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=evilz_vscode-reveal&metric=alert_status)](https://sonarcloud.io/dashboard?id=evilz_vscode-reveal)
[![Azure Pipeline](https://evilz.visualstudio.com/vscode-reveal/_apis/build/status/2)](https://evilz.visualstudio.com/vscode-reveal/_build?definitionId=2)

[![NODE.JS DEPENDENCIES](https://david-dm.org/evilz/vscode-reveal/status.svg)](https://david-dm.org/evilz/vscode-reveal)
[![NODE.JS DEV DEPENDENCIES](https://david-dm.org/evilz/vscode-reveal/dev-status.svg)](https://david-dm.org/evilz/vscode-reveal?type=dev)

[![Known Vulnerabilities](https://snyk.io/test/github/evilz/vscode-reveal/badge.svg?targetFile=package.json)](https://snyk.io/test/github/evilz/vscode-reveal?targetFile=package.json)

This extension let you display a reveal.js presentation directly from an opened markdown document.

![demo](https://github.com/evilz/vscode-reveal/raw/master/images/demo2.0-bis.gif)

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
- [FAQ](#faq)

## <a id="markdown"></a> Markdown

Create reveal.js presentation directly from markdown file,
open or create a new file in markdown and use default slide separator to see slide counter change in the status bar and title appear in the sidebar.

Since Reveal.js use marked to parse the markdown string you can use this in your document:

- GitHub flavored markdown.
- GFM tables

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
- Black (default)
- White
- League
- Sky
- Beige
- Simple
- Serif
- Blood
- Night
- Moon
- Solarized

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



## <a id="highlight"></a> Highlight Theme

You can use code block in your markdown that will be highlighted by highlight.js.
So you can configure the coloration theme by setting `revealjs.highlightTheme` parameter of VS Code, or set it using front matter.

```
---
highlightTheme : "other theme"
---
```

Get the theme list here https://highlightjs.org/

## <a id="options"></a> Reveal.js Options


You can customize many setting on for your reveal.js presentation.

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


This will try to use Chrome that is the best browser to use for reveal.js presentation, if it can't find it, your default browser will be used.


## <a id="pdf"></a> Print to PDF

To export your presentation to pdf you can:
- click on PDF icon in the sidebar
- call the command `Revealjs: Export in PDF`


This will try to launch Chrome or your default browser and launch printing.
Be sure to set print setting correctly:
- No margin
- print background


## <a id="htmlexport"></a> Export static Website

To export your presentation to a static website you can:
- click on HTML icon in the sidebar
- call the command `Revealjs: Export in HTML`


This will try to launch Chrome in headless or your default browser it takes about 10sec and then open the export folder.

## <a id="faq"></a> FAQ


> Note : The first time, Windows will ask you about the firewall. If you open the port for the application, you can see your presentation remotely.


## Known Issues

Please add issues on github.

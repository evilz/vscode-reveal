# vscode-reveal README

This extension let you display a reveal js presentation directly from an opened markdown document.

> This extension IS IN DEVELOPMENT and can have many bugs.

## Features

### Create revealjs presentation directly from markdown file

Sample of markdown : 

https://raw.githubusercontent.com/evilz/vscode-reveal/master/sample.md

### Display side by side or in browser

Call the command `Revealjs: Show presentation by side` to see your presentation next to your file.
Call the command `Revealjs: Open presentation in browser` to see it in default browser.

On save the current editing slide will be show !

### status bar

If your markdown file has more that one slide, status bar will display the slide count on right.
If you now click on it it will directly on RevealJS presentation next to the file.

Once you have at least show the presentation once, it will also display the http address that you can use directly in your browser. When you click on it, browser will open.

> Note : First time windows will ask you about firewall. If you open the port for the application, you can see your prensentation remotly.

### Front Matter !

You can change settings directly in your markdown file using front matter style. You can change all extention settings like this :

```
---
theme : "white"
transition: "zoom"
---
```

## Custom Theme

You can add custom style in a css file in same folder that your markdown.

exemple : 
if your file name is `my-theme.css` just add this in the front header :

```
---
customTheme : "my-theme"
---
```

Note that you can use both theme and custom theme as same time. Your custom theme will be loaded after to override default revealJS theme.

### Future :
- Create PDF from presentation

### demo
![demo](https://github.com/evilz/vscode-reveal/blob/master/images/demo.gif?raw=true)

## Extension Settings

You can customise many setting on for your revealjs presentation.

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
<tr><td><code>revealjs.controls</code></td><td>Display controls in the bottom right corner</td><td><code>true</code></td></tr><tr><td><code>revealjs.progress</code></td><td>Display a presentation progress bar</td><td><code>true</code></td></tr><tr><td><code>revealjs.slideNumber</code></td><td>Display the page number of the current slide</td><td><code></code></td></tr><tr><td><code>revealjs.history</code></td><td>Push each slide change to the browser history</td><td><code></code></td></tr><tr><td><code>revealjs.keyboard</code></td><td>Enable keyboard shortcuts for navigation</td><td><code>true</code></td></tr><tr><td><code>revealjs.overview</code></td><td>Enable the slide overview mode</td><td><code>true</code></td></tr><tr><td><code>revealjs.center</code></td><td>Vertical centering of slides</td><td><code>true</code></td></tr><tr><td><code>revealjs.touch</code></td><td>Enables touch navigation on devices with touch input</td><td><code>true</code></td></tr><tr><td><code>revealjs.loop</code></td><td>Loop the presentation</td><td><code></code></td></tr><tr><td><code>revealjs.rtl</code></td><td>Change the presentation direction to be RTL</td><td><code></code></td></tr><tr><td><code>revealjs.shuffle</code></td><td>Randomizes the order of slides each time the presentation loads</td><td><code></code></td></tr><tr><td><code>revealjs.fragments</code></td><td>Turns fragments on and off globally</td><td><code>true</code></td></tr><tr><td><code>revealjs.embedded</code></td><td>Flags if the presentation is running in an embedded mode, i.e. contained within a limited portion of the screen</td><td><code></code></td></tr><tr><td><code>revealjs.help</code></td><td>Flags if we should show a help overlay when the questionmark key is pressed</td><td><code>true</code></td></tr><tr><td><code>revealjs.showNotes</code></td><td>Flags if speaker notes should be visible to all viewers</td><td><code></code></td></tr><tr><td><code>revealjs.autoSlide</code></td><td>Number of milliseconds between automatically proceeding to the next slide, disabled when set to 0, this value can be overwritten by using a data-autoslide attribute on your slides</td><td><code></code></td></tr><tr><td><code>revealjs.autoSlideStoppable</code></td><td>Stop auto-sliding after user input</td><td><code>true</code></td></tr><tr><td><code>revealjs.mouseWheel</code></td><td>Enable slide navigation via mouse wheel</td><td><code></code></td></tr><tr><td><code>revealjs.hideAddressBar</code></td><td>Hides the address bar on mobile devices</td><td><code>true</code></td></tr><tr><td><code>revealjs.previewLinks</code></td><td>Opens links in an iframe preview overlay</td><td><code></code></td></tr><tr><td><code>revealjs.transition</code></td><td>Transition style (none/fade/slide/convex/concave/zoom)</td><td><code>default</code></td></tr><tr><td><code>revealjs.transitionSpeed</code></td><td>Transition speed (default/fast/slow)</td><td><code>default</code></td></tr><tr><td><code>revealjs.backgroundTransition</code></td><td>Transition style for full page slide backgrounds (none/fade/slide/convex/concave/zoom)</td><td><code>default</code></td></tr><tr><td><code>revealjs.viewDistance</code></td><td>Number of slides away from the current that are visible</td><td><code>3</code></td></tr><tr><td><code>revealjs.parallaxBackgroundImage</code></td><td>Parallax background image</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundSize</code></td><td>Parallax background size (CSS syntax, e.g. 2100px 900px)</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundHorizontal</code></td><td>Number of pixels to move the parallax background per slide</td><td><code></code></td></tr><tr><td><code>revealjs.parallaxBackgroundVertical</code></td><td>Number of pixels to move the parallax background per slide</td><td><code></code></td></tr></table>

## Known Issues

Please add issues on github.


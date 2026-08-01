# Configuration reference

VS Code Reveal contributes settings under the `revealjs.*` namespace. This table is generated from `package.json` during the docs build.

| Setting | Default | Type | Description and accepted values |
| --- | --- | --- | --- |
| `revealjs.controlsTutorial` | `true` | boolean | Help the user learn the controls by providing hints |
| `revealjs.controlsLayout` | `bottom-right` | string | Determines where controls appear Values: `bottom-right`, `edge` |
| `revealjs.controlsBackArrows` | `faded` | string | Visibility rule for backwards navigation arrows Values: `faded`, `hidden`, `visible` |
| `revealjs.showSlideNumber` | `all` | string | Can be used to limit the contexts in which the slide number appears Values: `all`, `print`, `speaker` |
| `revealjs.hashOneBasedIndex` | `false` | boolean | Use 1 based indexing for # links to match slide number |
| `revealjs.theme` | `black` | string | Revealjs Theme Values: `beige`, `black`, `blood`, `cern`, `hull-blue`, `league`, `material`, `moon`, `myplanet`, `night`, `object-partners`, `pikestreet`, `puzzle`, `robot-lung-ebi`, `robot-lung`, `savasian`, `serif`, `sfeir-school`, `simple`, `sky`, `solarized`, `sunblind`, `tidy`, `white` |
| `revealjs.highlightTheme` | `monokai` | string | highlight.js Theme Values: `a11y-dark`, `a11y-light`, `agate`, `an-old-hope`, `androidstudio`, `arduino-light`, `arta`, `ascetic`, `atom-one-dark-reasonable`, `atom-one-dark`, `atom-one-light`, `brown-paper`, `brown-papersq.png`, `codepen-embed`, `color-brewer`, `dark`, `devibeans`, `docco`, `far`, `foundation`, `github-dark-dimmed`, `github-dark`, `github`, `gml`, `googlecode`, `gradient-dark`, `gradient-light`, `grayscale`, `hybrid`, `idea`, `ir-black`, `isbl-editor-dark`, `isbl-editor-light`, `kimbie-dark`, `kimbie-light`, `lightfair`, `lioshi`, `magula`, `mono-blue`, `monokai-sublime`, `monokai`, `night-owl`, `nnfx-dark`, `nnfx-light`, `nord`, `obsidian`, `paraiso-dark`, `paraiso-light`, `pojoaque.jpg`, `pojoaque`, `purebasic`, `qtcreator-dark`, `qtcreator-light`, `rainbow`, `real-black`, `routeros`, `school-book`, `shades-of-purple`, `srcery`, `stackoverflow-dark`, `stackoverflow-light`, `sunburst`, `tomorrow-night-blue`, `tomorrow-night-bright`, `vs`, `vs2015`, `xcode`, `xt256` |
| `revealjs.diagramServerEnabled` | `true` | boolean | Enable remote diagram rendering for supported diagram languages via a Kroki-compatible server |
| `revealjs.diagramServerUrl` | `https://kroki.io` | string | Base URL for the Kroki-compatible diagram server used to render supported diagram languages |
| `revealjs.offline` | `false` | boolean | Disable externally hosted extension resources, including MathJax, seminar sockets, and remote diagram rendering |
| `revealjs.controls` | `true` | boolean | Display controls in the bottom right corner |
| `revealjs.progress` | `true` | boolean | Display a presentation progress bar |
| `revealjs.slideNumber` | `false` | boolean | string | Display the page number of the current slide. Use a Reveal.js format string such as h/v, h.v, c, or c/t to control formatting. |
| `revealjs.history` | `true` | boolean | Push each slide change to the browser history |
| `revealjs.keyboard` | `true` | boolean | object | Enable keyboard shortcuts for navigation, or provide a Reveal.js keyboard mapping object |
| `revealjs.overview` | `true` | boolean | Enable the slide overview mode |
| `revealjs.center` | `true` | boolean | Vertical centering of slides |
| `revealjs.touch` | `true` | boolean | Enables touch navigation on devices with touch input |
| `revealjs.loop` | `false` | boolean | Loop the presentation |
| `revealjs.rtl` | `false` | boolean | Change the presentation direction to be RTL |
| `revealjs.shuffle` | `false` | boolean | Randomizes the order of slides each time the presentation loads |
| `revealjs.fragments` | `true` | boolean | Turns fragments on and off globally |
| `revealjs.incremental` | `false` | boolean | Reveal list items one at a time as fragments |
| `revealjs.embedded` | `false` | boolean | Flags if the presentation is running in an embedded mode, i.e. contained within a limited portion of the screen |
| `revealjs.help` | `true` | boolean | Flags if we should show a help overlay when the questionmark key is pressed |
| `revealjs.showNotes` | `false` | boolean | Flags if speaker notes should be visible to all viewers |
| `revealjs.autoSlide` | `0` | number | Number of milliseconds between automatically proceeding to the next slide, disabled when set to 0, this value can be overwritten by using a data-autoslide attribute on your slides |
| `revealjs.autoSlideMethod` | `Reveal.navigateNext` | string | The direction in which the slides will move whilst autoslide is active |
| `revealjs.autoSlideStoppable` | `true` | boolean | Stop auto-sliding after user input |
| `revealjs.mouseWheel` | `false` | boolean | Enable slide navigation via mouse wheel |
| `revealjs.hideAddressBar` | `true` | boolean | Hides the address bar on mobile devices |
| `revealjs.previewLinks` | `false` | boolean | Opens links in an iframe preview overlay |
| `revealjs.transition` | `slide` | string | Transition style Values: `none`, `fade`, `slide`, `convex`, `concave`, `zoom` |
| `revealjs.transitionSpeed` | `default` | string | Transition speed Values: `default`, `fast`, `slow` |
| `revealjs.backgroundTransition` | `fade` | string | Transition style for full page slide backgrounds (none/fade/slide/convex/concave/zoom) Values: `none`, `fade`, `slide`, `convex`, `concave`, `zoom` |
| `revealjs.pdfMaxPagesPerSlide` | `null` | number | null | Maximum number of pages a slide can expand onto when exporting to PDF. Null keeps Reveal.js default behavior. |
| `revealjs.pdfSeparateFragments` | `true` | boolean | Print each fragment step on a separate PDF page. |
| `revealjs.pdfPageHeightOffset` | `-1` | number | Pixel offset applied to PDF page height calculations |
| `revealjs.viewDistance` | `3` | number | Number of slides away from the current that are visible |
| `revealjs.width` | `960` | number | Width of the presentation |
| `revealjs.height` | `700` | number | Height of the presentation |
| `revealjs.margin` | `0.04` | number | Factor of the display size that should remain empty around the content |
| `revealjs.minScale` | `0.2` | number | Bounds for smallest possible scale to apply to content |
| `revealjs.maxScale` | `2` | number | Bounds for largest  possible scale to apply to content |
| `revealjs.disableLayout` | `false` | boolean | disable the built-in scaling and centering and Bring Your Own Layout |
| `revealjs.parallaxBackgroundImage` | `` | string | Parallax background image |
| `revealjs.parallaxBackgroundSize` | `` | string | Parallax background size (CSS syntax, e.g. 2100px 900px) |
| `revealjs.parallaxBackgroundHorizontal` | `0` | number | Number of pixels to move the parallax background per slide |
| `revealjs.parallaxBackgroundVertical` | `0` | number | Number of pixels to move the parallax background per slide |
| `revealjs.slideExplorerEnabled` | `true` | boolean | Hide or show slides explorer |
| `revealjs.browserPath` | `null` | string | Full path of browser to use |
| `revealjs.exportHTMLPath` | `./export` | string | Path where the HTML export is created, relative to the .md file |
| `revealjs.openFilemanagerAfterHTMLExport` | `true` | boolean | Open the file manager after HTML export |
| `revealjs.selfContained` | `false` | boolean | Inline local export assets so HTML export produces one self-contained index.html file |
| `revealjs.enableMenu` | `true` | boolean | Enable the menu |
| `revealjs.enableChalkboard` | `true` | boolean | Enable the chalkboard |
| `revealjs.enableZoom` | `true` | boolean | Enable the zoom plugin |
| `revealjs.enableSearch` | `true` | boolean | Enable the search in slides |
| `revealjs.title` | `Reveal JS presentation` | string | Title of your presentation |
| `revealjs.htmlFragment` | `null` | string | null | Local HTML fragment file to inject into the rendered presentation body, resolved relative to the markdown file |
| `revealjs.css` | `[]` | array | External css file to use |
| `revealjs.cssvariables` | `null` | object | null | Css variable to add see https://github.com/hakimel/reveal.js/blob/master/css/theme/template/exposer.scss |

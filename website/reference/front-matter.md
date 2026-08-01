# Front matter reference

Front matter lets a presentation override its `revealjs.*` settings without changing the global VS Code configuration. This complete list is generated from `package.json` and the runtime configuration contract during the docs build.

<iframe class="parameter-preview" src="../examples/front-matter/index.html" title="Visual front matter parameter preview" loading="lazy"></iframe>

| Setting | Default | Type | Allowed values |
| --- | --- | --- | --- |
| `controlsTutorial` | `true` | boolean | `true`, `false` |
| `controlsLayout` | `bottom-right` | string | `bottom-right`, `edge` |
| `controlsBackArrows` | `faded` | string | `faded`, `hidden`, `visible` |
| `theme` | `black` | string | `beige`, `black`, `blood`, `cern`, `hull-blue`, `league`, `material`, `moon`, `myplanet`, `night`, `object-partners`, `pikestreet`, `puzzle`, `robot-lung-ebi`, `robot-lung`, `savasian`, `serif`, `sfeir-school`, `simple`, `sky`, `solarized`, `sunblind`, `tidy`, `white` |
| `highlightTheme` | `monokai` | string | `a11y-dark`, `a11y-light`, `agate`, `an-old-hope`, `androidstudio`, `arduino-light`, `arta`, `ascetic`, `atom-one-dark-reasonable`, `atom-one-dark`, `atom-one-light`, `brown-paper`, `brown-papersq.png`, `codepen-embed`, `color-brewer`, `dark`, `devibeans`, `docco`, `far`, `foundation`, `github-dark-dimmed`, `github-dark`, `github`, `gml`, `googlecode`, `gradient-dark`, `gradient-light`, `grayscale`, `hybrid`, `idea`, `ir-black`, `isbl-editor-dark`, `isbl-editor-light`, `kimbie-dark`, `kimbie-light`, `lightfair`, `lioshi`, `magula`, `mono-blue`, `monokai-sublime`, `monokai`, `night-owl`, `nnfx-dark`, `nnfx-light`, `nord`, `obsidian`, `paraiso-dark`, `paraiso-light`, `pojoaque.jpg`, `pojoaque`, `purebasic`, `qtcreator-dark`, `qtcreator-light`, `rainbow`, `real-black`, `routeros`, `school-book`, `shades-of-purple`, `srcery`, `stackoverflow-dark`, `stackoverflow-light`, `sunburst`, `tomorrow-night-blue`, `tomorrow-night-bright`, `vs`, `vs2015`, `xcode`, `xt256` |
| `diagramServerEnabled` | `true` | boolean | `true`, `false` |
| `diagramServerUrl` | `https://kroki.io` | string | Any string |
| `offline` | `false` | boolean | `true`, `false` |
| `controls` | `true` | boolean | `true`, `false` |
| `progress` | `true` | boolean | `true`, `false` |
| `slideNumber` | `false` | boolean, string | `true`, `false`; Any string |
| `history` | `true` | boolean | `true`, `false` |
| `keyboard` | `true` | boolean, object | `true`, `false`; Object matching the setting schema |
| `overview` | `true` | boolean | `true`, `false` |
| `center` | `true` | boolean | `true`, `false` |
| `touch` | `true` | boolean | `true`, `false` |
| `loop` | `false` | boolean | `true`, `false` |
| `rtl` | `false` | boolean | `true`, `false` |
| `shuffle` | `false` | boolean | `true`, `false` |
| `fragments` | `true` | boolean | `true`, `false` |
| `incremental` | `false` | boolean | `true`, `false` |
| `embedded` | `false` | boolean | `true`, `false` |
| `help` | `true` | boolean | `true`, `false` |
| `showNotes` | `false` | boolean | `true`, `false` |
| `autoSlide` | `0` | number | Any number |
| `autoSlideMethod` | `Reveal.navigateNext` | string | Any string |
| `autoSlideStoppable` | `true` | boolean | `true`, `false` |
| `mouseWheel` | `false` | boolean | `true`, `false` |
| `hideAddressBar` | `true` | boolean | `true`, `false` |
| `previewLinks` | `false` | boolean | `true`, `false` |
| `transition` | `slide` | string | `none`, `fade`, `slide`, `convex`, `concave`, `zoom` |
| `transitionSpeed` | `default` | string | `default`, `fast`, `slow` |
| `backgroundTransition` | `fade` | string | `none`, `fade`, `slide`, `convex`, `concave`, `zoom` |
| `pdfMaxPagesPerSlide` | `null` | number, null | Any number; `null` |
| `pdfSeparateFragments` | `true` | boolean | `true`, `false` |
| `pdfPageHeightOffset` | `-1` | number | Any number |
| `viewDistance` | `3` | number | Any number |
| `width` | `960` | number | Any number |
| `height` | `700` | number | Any number |
| `margin` | `0.04` | number | Any number |
| `minScale` | `0.2` | number | Any number |
| `maxScale` | `2` | number | Any number |
| `disableLayout` | `false` | boolean | `true`, `false` |
| `parallaxBackgroundImage` | `` | string | Any string |
| `parallaxBackgroundSize` | `` | string | Any string |
| `parallaxBackgroundHorizontal` | `0` | number | Any number |
| `parallaxBackgroundVertical` | `0` | number | Any number |
| `slideExplorerEnabled` | `true` | boolean | `true`, `false` |
| `browserPath` | `null` | string | Any string |
| `exportHTMLPath` | `./export` | string | Any string |
| `openFilemanagerAfterHTMLExport` | `true` | boolean | `true`, `false` |
| `selfContained` | `false` | boolean | `true`, `false` |
| `enableMenu` | `true` | boolean | `true`, `false` |
| `enableChalkboard` | `true` | boolean | `true`, `false` |
| `enableZoom` | `true` | boolean | `true`, `false` |
| `enableSearch` | `true` | boolean | `true`, `false` |
| `title` | `Reveal JS presentation` | string | Any string |
| `htmlFragment` | `null` | string, null | Any string; `null` |
| `css` | `[]` | array | Array value |
| `cssvariables` | `null` | object, null | Object matching the setting schema; `null` |
| `author` | `` | string | Any string |
| `autoPlayMedia` | `false` | boolean | `true`, `false` |
| `customHighlightTheme` | `null` | string, null | Any string; `null` |
| `customTheme` | `null` | string, null | Any string; `null` |
| `defaultTiming` | `120` | number | Any number |
| `description` | `` | string | Any string |
| `display` | `block` | string | `block` |
| `enableTitleFooter` | `true` | boolean | `true`, `false` |
| `fragmentInURL` | `false` | boolean | `true`, `false` |
| `logLevel` | `3` | number | `0`, `1`, `2`, `3`, `4` |
| `logoImg` | `null` | string, null | Any string; `null` |
| `notesSeparator` | `note:` | string | Any string |
| `separator` | `^\r?\n---\r?\n$` | string | Any string |
| `verticalSeparator` | `^\r?\n--\r?\n$` | string | Any string |

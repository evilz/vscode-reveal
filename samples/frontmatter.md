---
toto:
  - titi: "cool"
  - tutu: 1235
#### REVEAL JS CONFIG ####
controls: true
controlsTutorial: true #boolean
controlsLayout: edges #'edges'  | 'bottom-right'
controlsBackArrows: visible #'faded' | 'hidden' | 'visible'
progress: true
slideNumber: true
#showSlideNumber "all" "print" "speaker"
# hashOneBasedIndex: false,
#  hash: false,
# respondToHashChanges: true,
# history: false,
keyboard: true
#keyboardCondition: null,
overview: true
center: false
touch: true
loop: true
rtl: true
#navigationMode: 'default', linear grid
shuffle: false
fragments: false
fragmentInURL: true
embedded: false
help: false
#pause: true
showNotes: true
autoPlayMedia: true
#preloadIframes: null. true false
#autoAnimate: true
#autoAnimateMatcher: null,
#autoAnimateEasing: 'ease',
#autoAnimateDuration: 1.0,
#autoAnimateUnmatched: true
#autoAnimateStyles: []
autoSlide: 5000
autoSlideStoppable: false
autoSlideMethod: null
defaultTiming: 3
mouseWheel: true
#previewLinks: false
#postMessage: true,
#postMessageEvents: false,
#focusBodyOnPageVisibilityChange: true,
transition: zoom
transitionSpeed: slow
backgroundTransition: convex
#pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,
#pdfSeparateFragments: true,
#pdfPageHeightOffset: -1,
viewDistance: 10
#mobileViewDistance: 2,
display: grid
#hideInactiveCursor: true,
#hideCursorTime: 5000

width: 400
height: 1320
margin: 0.04
minScale: 0.2
maxScale: 2.0
disableLayout: false

parallaxBackgroundImage: https://miro.medium.com/max/3622/1*RoXcbaF9lIqwpMjiXg54Vw.png
parallaxBackgroundSize: 2100px 1320px
parallaxBackgroundHorizontal: 200
parallaxBackgroundVertical: 150


#### VSCODE EXTENSION CONFIG ####
# separator: string
# verticalSeparator: string
# notesSeparator: string
title: test config
theme: blood
highlightTheme: hybrid
# customTheme: string | null
# customHighlightTheme: string | null



# hideAddressBar: boolean

# layout: string
# logoImg: string | null
# description: string
# author: string

enableMenu: false
enableChalkboard: false
#enableTitleFooter: boolean
enableZoom: false
enableSearch: false
---

# front matter ! 

---

# slide 2

```js
public onDidChangeTextDocument(e: TextDocumentChangeEvent) {
    console.log('onDidChangeTextDocument')
  }
```

---

# slide 3

- fragment {class="fragment"}

note: hello world !
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
shuffle: true
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

#width: 960,
#height: 700,
#margin: 0.04,
#minScale: 0.2,
#maxScale: 2.0
#disableLayout: false

parallaxBackgroundImage: https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg
parallaxBackgroundSize: 2100px 900px
parallaxBackgroundHorizontal: 200
parallaxBackgroundVertical: 50


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




# title: string // TODO : should take first big title or can be set
# layout: string
# logoImg: string | null
# description: string
# author: string

# enableMenu: boolean
# enableChalkboard: boolean
# enableTitleFooter: boolean
# enableZoom: boolean
# enableSearch: boolean
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
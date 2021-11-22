---
theme: black
enableMenu: false
parallaxBackgroundImage: https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg
parallaxBackgroundSize: 2100px 900px
parallaxBackgroundHorizontal: 200
parallaxBackgroundVertical: 50
---

[![reveal.js logo](https://static.slid.es/reveal/logo-v1/reveal-white-text.svg)](https://revealjs.com) {style="height: 180px; margin: 0 auto 4rem auto; background: transparent;"}

### The HTML Presentation Framework

<small>Created by [Hakim El Hattab](http://hakim.se) and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors)</small>

---

## Hello There

reveal.js enables you to create beautiful interactive slide decks using HTML. This presentation will show you examples of what it can do.

--

## Vertical Slides

Slides can be nested inside of each other.

Use the _Space_ key to navigate through all slides.

![Down arrow](https://static.slid.es/reveal/arrow.png) {style="background: rgba(255,255,255,0.1);" width="178" height="238" }

--

## Basement Level 1

Nested slides are useful for adding additional detail underneath a high level horizontal slide.

--

Basement Level 2
----------------

That's it, time to go back up.


---

Slides
------

Not a coder? Not a problem. There's a fully-featured visual editor for authoring these, try it out at [https://slides.com](https://slides.com).

---

<!-- .slide: data-visibility="hidden" -->
Hidden Slides
-------------

This slide is visible in the source, but hidden when the presentation is viewed. You can show all hidden slides by setting the \`showHiddenSlides\` config option to \`true\`.

---

<!-- .slide: data-auto-animate -->
Pretty Code
-----------

```js
import React, { useState } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    return (
    ...
    );
}
```
    					

Code syntax highlighting courtesy of [highlight.js](https://highlightjs.org/usage/).

---

<!-- .slide: data-auto-animate -->

With animations
---------------

```js {data-trim data-line-numbers="|4,8-11|17|22-24"}
import React, { useState } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    return (
    <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
        Click me
        </button>
    </div>
    );
}

function SecondExample() {
    const [count, setCount] = useState(0);

    return (
    <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
        Click me
        </button>
    </div>
    );
}
``` 

---

Point of View
-------------

Press **ESC** to enter the slide overview.

Hold down the **alt** key (**ctrl** in Linux) and click on any element to zoom towards it using [zoom.js](http://lab.hakim.se/zoom-js). Click again to zoom back out.

(NOTE: Use ctrl + click in Linux.)

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->

Auto-Animate
------------

Automatically animate matching elements across slides with [Auto-Animate](https://revealjs.com/auto-animate/).

<div class="r-hstack justify-center">
<div data-id="box1" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
<div data-id="box2" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
<div data-id="box3" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
</div>

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->

<div class="r-hstack justify-center">
<div data-id="box1" data-auto-animate-delay="0" style="background: cyan; width: 150px; height: 100px; margin: 10px;"></div>
<div data-id="box2" data-auto-animate-delay="0.1" style="background: magenta; width: 150px; height: 100px; margin: 10px;"></div>
<div data-id="box3" data-auto-animate-delay="0.2" style="background: yellow; width: 150px; height: 100px; margin: 10px;"></div>
</div>
## Auto-Animate {style="margin-top: 20px;"}

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->

<div class="r-stack">
    <div data-id="box1" style="background: cyan; width: 300px; height: 300px; border-radius: 200px;"></div>
    <div data-id="box2" style="background: magenta; width: 200px; height: 200px; border-radius: 200px;"></div>
    <div data-id="box3" style="background: yellow; width: 100px; height: 100px; border-radius: 200px;"></div>
</div>

## Auto-Animate {style="margin-top: 20px;"}

---

## Touch Optimized

Presentations look great on touch devices, like mobile phones and tablets. Simply swipe through your slides.

---

## Markdown support

Write content using inline or external Markdown.
Instructions and more info available in the [docs](https://revealjs.com/markdown/).

```md
## Markdown support
Write content using inline or external Markdown.
Instructions and more info available in the [docs](https://revealjs.com/markdown/).
```

---

Add the 
`r-fit-text` class to auto-size text
## FIT TEXT {class="r-fit-text"}

---

## Fragments

Hit the next arrow...{class="fragment"}

... to step through ...{class="fragment"}

... a fragmented slide.{class="fragment"}

This slide has fragments which are also stepped through in the notes window.

<aside class="notes">
    This slide has fragments which are also stepped through in the notes window.
</aside>

---

## Fragment Styles

There's different types of fragments, like:

grow {class="fragment grow"}

shrink {class="fragment shrink"}

fade-out {class="fragment fade-out"}

<span style="display: inline-block;" class="fragment fade-right">fade-right, </span>
<span style="display: inline-block;" class="fragment fade-up">up, </span>
<span style="display: inline-block;" class="fragment fade-down">down, </span>
<span style="display: inline-block;" class="fragment fade-left">left</span>

fade-in-then-out {class="fragment fade-in-then-out"}

fade-in-then-semi-out {class="fragment fade-in-then-semi-out"}

Highlight <span class="fragment highlight-red">red</span> <span class="fragment highlight-blue">blue</span> <span class="fragment highlight-green">green</span>

---

Transition Styles
-----------------

You can select from different transitions, like:  
[None](?transition=none#/transitions) - [Fade](?transition=fade#/transitions) - [Slide](?transition=slide#/transitions) - [Convex](?transition=convex#/transitions) - [Concave](?transition=concave#/transitions) - [Zoom](?transition=zoom#/transitions)

---

Themes
------

reveal.js comes with a few themes built in:  
[Black (default)](#) - [White](#) - [League](#) - [Sky](#) - [Beige](#) - [Simple](#)  
[Serif](#) - [Blood](#) - [Night](#) - [Moon](#) - [Solarized](#)

---

<!-- .slide: data-background="#dddddd" -->
Slide Backgrounds
-----------------

Set `data-background="#dddddd"` on a slide to change the background color. All CSS color formats are supported.

<a href="#" class="navigate-down">
    <img class="r-frame" style="background: rgba(255,255,255,0.1);" width="178" height="238" data-src="https://static.slid.es/reveal/arrow.png" alt="Down arrow">
</a>

--

<!-- .slide: data-background="image-placeholder.png" -->
## Image Backgrounds

```html
<!-- .slide: data-background="image.png" -->
```

--

<!-- .slide: data-background="https://static.slid.es/reveal/image-placeholder.png" data-background-repeat="repeat" data-background-size="100px" -->

## Tiled Backgrounds

```html
<!-- .slide: 
data-background="https://static.slid.es/reveal/image-placeholder.png"
data-background-repeat="repeat" 
data-background-size="100px" -->
```

---

<!-- .slide: data-background-video="https://static.slid.es/site/homepage/v1/homepage-video-editor.mp4" data-background-color="#000000" -->

::: block {style="background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px;"}
## Video Backgrounds
```html
<!-- .slide: data-background-video="https://static.slid.es/site/homepage/v1/homepage-video-editor.mp4" data-background-color="#000000" -->
```
:::

---

<!-- .slide: data-background="http://i.giphy.com/90F8aUepslB84.gif" -->

## ... and GIFs!

---

<!-- .slide: data-transition="slide" data-background="#4d7e65" data-background-transition="zoom" -->

## Background Transitions

Different background transitions are available via the backgroundTransition option. This one's called "zoom".

```md
<!-- .slide: data-transition="slide" data-background="#4d7e65" data-background-transition="zoom" -->
```

---

<!-- .slide: data-transition="slide" data-background="#b5533c" data-background-transition="zoom" -->

## Background Transitions

You can override background transitions per-slide.

```md
<!-- .slide: data-transition="slide" data-background="#b5533c" data-background-transition="zoom" -->
```
---

<!-- .slide:  data-background-iframe="https://hakim.se" data-background-interactive  -->

::: block {style="position: absolute; width: 40%; right: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.5), 0 5px 25px rgba(0,0,0,0.2); background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px; font-size: 20px; text-align: left;"}
## Iframe Backgrounds</h2>

Since reveal.js runs on the web, you can easily embed other web content. Try interacting with the page in the background.
:::

---

Marvelous List
--------------

*   No order here
*   Or here
*   Or here
*   Or here

---

Fantastic Ordered List
----------------------

1.  One is smaller than...
2.  Two is smaller than...
3.  Three!

---

Tabular Tables
--------------

|Item|Value|Quantity|
|--- |--- |--- |
|Apples|$1|7|
|Lemonade|$2|18|
|Bread|$3|2|

---

Clever Quotes
-------------

These guys come in two forms, inline: The nice thing about standards is that there are so many to choose from and block:

> “For years there has been a theory that millions of monkeys typing at random on millions of typewriters would reproduce the entire works of Shakespeare. The Internet has proven this theory to be untrue.”

---

Intergalactic Interconnections
------------------------------

You can link between slides internally, [like this](#/2/3).

---

Speaker View
------------

There's a [speaker view](https://revealjs.com/speaker-view/). It includes a timer, preview of the upcoming slide as well as your speaker notes.

Press the _S_ key to try it out.

<aside class="notes">
Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit 's' on your keyboard).
</aside>

---

Export to PDF
-------------

Presentations can be [exported to PDF](https://revealjs.com/pdf-export/), here's an example:

<iframe data-src="https://www.slideshare.net/slideshow/embed_code/42840540" width="445" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:3px solid #666; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

---

Global State
------------

Set `data-state="something"` on a slide and `"something"` will be added as a class to the document element when the slide is open. This lets you apply broader style changes, like switching the page background.

---

<!-- .slide: data-state="customevent"  -->

State Events
------------



Additionally custom events can be triggered on a per slide basis by binding to the `data-state` name.

    
    Reveal.on( 'customevent', function() {
    	console.log( '"customevent" has fired' );
    } );

---

Take a Moment
-------------

Press B or . on your keyboard to pause the presentation. This is helpful when you're on stage and want to take distracting slides off the screen.

---

Much more
---------

*   Right-to-left support
*   [Extensive JavaScript API](https://revealjs.com/api/)
*   [Auto-progression](https://revealjs.com/auto-slide/)
*   [Parallax backgrounds](https://revealjs.com/backgrounds/#parallax-background)
*   [Custom keyboard bindings](https://revealjs.com/keyboard/)

---

<!-- .slide: style="text-align: left;"  -->
THE END
=======

\- [Try the online editor](https://slides.com)  
\- [Source code & documentation](https://github.com/hakimel/reveal.js)
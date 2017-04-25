---
theme : "white"
transition: "zoom"
highlightTheme: "darkula"
---

# vscode-reveal

### Awesome VS code extension using The HTML Presentation Framework Revealjs

<small>Created by [Hakim El Hattab](http://hakim.se) / [@hakimel](http://twitter.com/hakimel)</small>

---

## Hello There

reveal.js enables you to create beautiful interactive slide decks using HTML. This presentation will show you examples of what it can do.

---

## Vertical Slides

Slides can be nested inside of each other.

Use the _Space_ key to navigate through all slides.

<a href="#" class="navigate-down">
    <img width="178" height="238" data-src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Down arrow">
</a>

--

## Basement Level 1

Nested slides are useful for adding additional detail underneath a high level horizontal slide.

--

## Basement Level 2

That's it, time to go back up.
						
<a href="#/2">
    <img width="178" height="238" data-src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Up arrow" style="transform: rotate(180deg); -webkit-transform: rotate(180deg);">
</a>

---

## Slides

Not a coder? Not a problem. There's a fully-featured visual editor for authoring these, try it out at [http://slides.com](http://slides.com).

---

## Point of View

Press **ESC** to enter the slide overview.

Hold down alt and click on any element to zoom in on it using [zoom.js](http://lab.hakim.se/zoom-js). Alt + click anywhere to zoom back out.

---

## Touch Optimized

Presentations look great on touch devices, like mobile phones and tablets. Simply swipe through your slides.

---


						## Markdown support

						Write content using inline or external Markdown.
						Instructions and more info available in the [readme](https://github.com/hakimel/reveal.js#markdown).

--
```
						  ## Markdown support

						  Write content using inline or external Markdown.
						  Instructions and more info available in the [readme](https://github.com/hakimel/reveal.js#markdown).
						```

---

## Fragments

Hit the next arrow...

... to step through ...
<span class="fragment">... a</span> <span class="fragment">fragmented</span> <span class="fragment">slide.</span>

Note:
This slide has fragments which are also stepped through in the notes window.

--

## Fragment Styles

There's different types of fragments, like:

grow    <!-- .element: class="fragment grow" -->

shrink  <!-- .element: class="fragment shrink" -->

fade-out    <!-- .element: class="fragment fade-out " -->

fade-up (also down, left and right!) <!-- .element: class="fragment fade-up" -->

current-visible <!-- .element: class="fragment current-visible" -->

Highlight <span class="fragment highlight-red">red</span> <span class="fragment highlight-blue">blue</span> <span class="fragment highlight-green">green</span>

---

## Transition Styles

You can select from different transitions, like:  
[None](?transition=none#/transitions) - [Fade](?transition=fade#/transitions) - [Slide](?transition=slide#/transitions) - [Convex](?transition=convex#/transitions) - [Concave](?transition=concave#/transitions) - [Zoom](?transition=zoom#/transitions)

---

## Themes

reveal.js comes with a few themes built in:  
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/black.css'); return false;">Black (default)</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/white.css'); return false;">White</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/league.css'); return false;">League</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/sky.css'); return false;">Sky</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/beige.css'); return false;">Beige</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/simple.css'); return false;">Simple</a> <br>
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/serif.css'); return false;">Serif</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/blood.css'); return false;">Blood</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/night.css'); return false;">Night</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/moon.css'); return false;">Moon</a> -
<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/solarized.css'); return false;">Solarized</a>

---

<!-- .slide: data-background="#dddddd" -->
## Slide Backgrounds

Set `data-background="#dddddd"` on a slide to change the background color. All CSS color formats are supported.
						<a href="#" class="navigate-down">
							<img width="178" height="238" data-src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Down arrow">
						</a>

--

<!-- .slide: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" -->

## Image Backgrounds

```markdown
<!-- .slide: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" -->
```

--

<!-- .slide: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" data-background-repeat="repeat" data-background-size="100px" -->

## TILED BACKGROUNDS				

```markdown
<!-- .slide: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" data-background-repeat="repeat" data-background-size="100px" -->
```

--

<!-- .slide: data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4,https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.webm" data-background-color="#000000" -->

## Video Backgrounds				

```markdown
<!-- .slide: data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4,https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.webm" data-background-color="#000000" -->
```

--

<!-- .slide: data-background="http://i.giphy.com/90F8aUepslB84.gif" -->

## ... and GIFs!				

```markdown
<!-- .slide: data-background="http://i.giphy.com/90F8aUepslB84.gif" -->
```

---

<!-- .slide: data-transition="slide" data-background="#4d7e65" data-background-transition="zoom" -->

## Background Transitions

Different background transitions are available via the backgroundTransition option. This one's called "zoom".

---

<!-- .slide: data-transition="slide" data-background="#b5533c" data-background-transition="zoom" -->

## Background Transitions

You can override background transitions per-slide.

---

## Pretty Code
```js
function linkify( selector ) {
  if( supports3DTransforms ) {

    var nodes = document.querySelectorAll( selector );

    for( var i = 0, len = nodes.length; i &lt; len; i++ ) {
      var node = nodes[i];

      if( !node.className ) {
        node.className += ' roll';
      }
    }
  }
}
```

Code syntax highlighting courtesy of [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/).

---

## Marvelous List

*   No order here
*   Or here
*   Or here
*   Or here

---

## Fantastic Ordered List

1.  One is smaller than...
2.  Two is smaller than...
3.  Three!

---

## Tabular Tables
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

---

## Clever Quotes

These guys come in two forms, inline: <q cite="http://searchservervirtualization.techtarget.com/definition/Our-Favorite-Technology-Quotations">“The nice thing about standards is that there are so many to choose from”</q> and block:

> “For years there has been a theory that millions of monkeys typing at random on millions of typewriters would reproduce the entire works of Shakespeare. The Internet has proven this theory to be untrue.”

---

## Intergalactic Interconnections

You can link between slides internally, [like this](#/2/3).

---

## Speaker View

There's a [speaker view](https://github.com/hakimel/reveal.js#speaker-notes). It includes a timer, preview of the upcoming slide as well as your speaker notes.

Press the _S_ key to try it out.

<aside class="notes">Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit 's' on your keyboard).</aside>

---

## Export to PDF

Presentations can be [exported to PDF](https://github.com/hakimel/reveal.js#pdf-export), here's an example:

<iframe data-src="https://www.slideshare.net/slideshow/embed_code/42840540" width="445" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:3px solid #666; margin-bottom:5px; max-width: 100%;" allowfullscreen=""></iframe>

---

## Global State

Set `data-state="something"` on a slide and `"something"` will be added as a class to the document element when the slide is open. This lets you apply broader style changes, like switching the page background.

---

<!-- .slide: data-state="customevent" -->

## State Events

Additionally custom events can be triggered on a per slide basis by binding to the `data-state` name.
```js
Reveal.addEventListener( 'customevent', function() {
	console.log( '"customevent" has fired' );
} );
```

---

## Take a Moment

Press B or . on your keyboard to pause the presentation. This is helpful when you're on stage and want to take distracting slides off the screen.

---

## Much more

*   Right-to-left support
*   [Extensive JavaScript API](https://github.com/hakimel/reveal.js#api)
*   [Auto-progression](https://github.com/hakimel/reveal.js#auto-sliding)
*   [Parallax backgrounds](https://github.com/hakimel/reveal.js#parallax-background)
*   [Custom keyboard bindings](https://github.com/hakimel/reveal.js#keyboard-bindings)

---

<!-- .slide: style="text-align: left;" -->
# THE END

- [Try the online editor](http://slides.com)  
- [Source code & documentation](https://github.com/hakimel/reveal.js)

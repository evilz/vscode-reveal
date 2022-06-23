---
theme: night
width: 1920
height:  1080
css:
  - https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css
---

<!-- .slide: class="grid" style="--cols-xl: 2;width:100%" -->

  <div style="border:1px  solid white;--row-xl: span 2">1</div>
  <div  style="border:1px  solid white;">2</div>
  <div  style="border:1px  solid white;" >3</div>
  <div style="border:1px  solid white;--col-xl: span 2">4</div>

--


<!-- .slide: data-background-image="https://i.stack.imgur.com/HLiKD.jpg" -->

::: .container

::: left
# Left 
*menu here*
- 
:::


::: right
# Right
- with
- a
- list
:::

:::

--

<!-- .slide: data-state="layout-bg50" data-background-image="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?cs=srgb&dl=pexels-athena-2582937.jpg&fm=jpg&w=4000&h=6000" -->

# 50 percent 

<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

--

<!-- .slide: data-state="layout-bg33" data-background-image="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?cs=srgb&dl=pexels-athena-2582937.jpg&fm=jpg&w=4000&h=6000" -->

# 33 percent 

<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

--

<!-- .slide: data-state="layout-bg33r" data-background-image="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?cs=srgb&dl=pexels-athena-2582937.jpg&fm=jpg&w=4000&h=6000" -->

# 33 percent  r

<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

--

<!-- .slide: data-state="layout-bg50r" data-background-image="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?cs=srgb&dl=pexels-athena-2582937.jpg&fm=jpg&w=4000&h=6000" -->

# 50 percent r

<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

--

<!-- .slide: data-background-image="https://wallpapercave.com/wp/PDg6l0Y.jpg" -->


<div class="grid" style="--ji-xl: center; --ai-xl: center;">
  <div>1111111111111111</div>
  <div style="--col-xl: span 2;">222222222222222</div>
  <div>33333333333333333333333</div>
</div>

<br/>


::: {.grid style="--cols-xl: 3;"}

 
::: left
### Left 
:::

::: middle
### middle
:::


::: right
### Right
:::

:::

<br/>


::: .container

::: left
### Left 

:::

::: middle
### middle
 
:::


::: right
### Right
:::

:::

--

::: {.grid style="--cols-xl: 2;"}

  <div  style=" background:red;">left</div>
  <div  style="background:blue;" >right</div>
:::

<br />

::: {.col style="height:100%; background:red; left:-8.33%;text-align: left; float: left; width:50%; z-index:-10;"}
Column 1 Content
:::
::: {.col style="background:blue;left:31.25%; top: 75px;  float: right;  text-align: right;  z-index:-10;  width:50%;"}
Column 2 Content
:::

---

# Stack

The `r-stack` layout helper lets you center and place multiple elements on top of each other. This is intended to be used together with fragments to incrementally reveal elements.

--

![](https://placekitten.com/450/300){.fragment}
![](https://placekitten.com/300/450){.fragment}
![](https://placekitten.com/400/400){.fragment}
{.r-stack}

--

![](https://placekitten.com/450/300){.fragment .fade-out data-fragment-index="0"}
![](https://placekitten.com/300/450){.fragment .current-visible data-fragment-index="0"}
![](https://placekitten.com/400/400){.fragment}
{.r-stack}

---

# Fit Text

The `r-fit-text` class makes text as large as possible without overflowing the slide. This is great when you want BIG text without having to manually find the right font size. Powered by fitty ❤️

--


## BIG {.r-fit-text}

--

## FIT TEXT {.r-fit-text}
## CAN BE USED FOR MULTIPLE HEADLINES {.r-fit-text}

---

# Stretch

The `r-stretch` layout helper lets you resize an element, like an image or video, to cover the remaining vertical space in a slide

--

## Stretch Example

![](https://revealjs.com/images/slides-symbol-512x512.png)
{.r-stretch}

Image byline

---

# Frame

Decorate any element with `r-frame` to make it stand out against the background. If the framed element is placed inside an anchor, we'll apply a hover effect to the border.

--

![](https://revealjs.com/images/logo/reveal-symbol.svg){width=200}
[![](https://revealjs.com/images/logo/reveal-symbol.svg){.r-frame width=200}](#)


---

<!-- .slide: data-background-image="https://i.stack.imgur.com/HLiKD.jpg" -->

::: .container

::: left
# Left 
*menu here*
- 
:::


::: right
# Right
- with
- a
- list
:::

:::

---

<!-- .slide: data-background-image="https://wallpapercave.com/wp/PDg6l0Y.jpg" -->

::: .container

::: left
### Left 

:::

::: middle
### middle
 
:::


::: right
### Right
:::

:::

---

::: {.col style="height:100%; background:red; left:-8.33%;text-align: left; float: left; width:50%; z-index:-10;"}
Column 1 Content
:::
::: {.col style="background:blue;left:31.25%; top: 75px;  float: right;  text-align: right;  z-index:-10;  width:50%;"}
Column 2 Content
:::


---

# Bootstrap

This text is a `secondary`{.badge .text-bg-secondary} badge

<span class="badge text-bg-primary">Primary</span>

<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-light">Light</button>
<button type="button" class="btn btn-dark">Dark</button>

---

<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
  <label class="form-check-label" for="flexCheckChecked">
    Checked checkbox
  </label>
</div>

---

<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>
<div class="alert alert-secondary" role="alert">
  A simple secondary alert—check it out!
</div>
<div class="alert alert-success" role="alert">
  A simple success alert—check it out!
</div>
<div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
</div>
<div class="alert alert-warning" role="alert">
  A simple warning alert—check it out!
</div>
<div class="alert alert-info" role="alert">
  A simple info alert—check it out!
</div>
<div class="alert alert-light" role="alert">
  A simple light alert—check it out!
</div>
<div class="alert alert-dark" role="alert">
  A simple dark alert—check it out!
</div>

---

<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

---

<div class="progress" style="height: 20px;">
  <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
</div>

---

<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-secondary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-success" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-danger" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-warning" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-info" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-light" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-dark" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

---


<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="..." class="rounded me-2" alt="...">
    <strong class="me-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>

---


<!-- .slide: class="bg-primary text-light" -->

# blue BG

---



<!-- .slide: class="bg-light" -->

```js{.shadow-lg}
function trucdefou(){
  return truc;
}
```

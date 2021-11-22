---
title: Layout sample
theme: white
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


---
highlightTheme: monokai

---

<!-- .slide:  data-auto-animate -->

# Auto-Animate

---

<!-- .slide:  data-auto-animate -->

# Auto-Animate {style="margin-top: 100px; color: red;}


---

<!-- .slide:  data-auto-animate -->

# Implicit
---

<!-- .slide:  data-auto-animate -->

# Implicit
# Animation

---

<!-- .slide:  data-auto-animate -->

::: {data-id="box" style="height: 50px; background: salmon;"}
:::

---

<!-- .slide:  data-auto-animate -->

::: {data-id="box" style="height: 200px; background: blue;"}
:::


---

<!-- .slide:  data-auto-animate -->

# Group A

---

<!-- .slide:  data-auto-animate -->

# Group A {style="color: #3B82F6;"}

---

<!-- .slide:  data-auto-animate  data-auto-animate-id="two"-->

# Group B

---

<!-- .slide:  data-auto-animate  data-auto-animate-id="two"-->

# Group B {style="color: #10B981;"}

---

<!-- .slide:  data-auto-animate  data-auto-animate-id="two" data-auto-animate-restart-->

# Group C

---

<!-- .slide:  data-auto-animate  data-auto-animate-id="two"-->

# Group C {style="color: #EC4899;"}

---

<!-- .slide:  data-auto-animate -->

<pre data-id="code-animation"><code data-trim data-line-numbers>
let planets = [
    { name: 'mars', diameter: 6779 },
]
</code></pre>

---

<!-- .slide:  data-auto-animate -->

<pre data-id="code-animation"><code data-trim data-line-numbers>
let planets = [
    { name: 'mars', diameter: 6779 },
    { name: 'earth', diameter: 12742 },
    { name: 'jupiter', diameter: 139820 }
]
</code></pre>

---

<!-- .slide:  data-auto-animate -->

::: {data-id="code-animation"}
```js {data-trim data-line-numbers}
let circumferenceReducer = ( c, planet ) => {
    return c + planet.diameter * Math.PI;
}

let planets = [
    { name: 'mars', diameter: 6779 },
    { name: 'earth', diameter: 12742 },
    { name: 'jupiter', diameter: 139820 }
]

let c = planets.reduce( circumferenceReducer, 0 )
```
:::


---

```js {data-line-numbers="1-2|3|4"}
let a = 1;
let b = 2;
let c = x => 1 + 2 + x;
c(3);
```


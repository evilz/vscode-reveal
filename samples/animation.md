---
customTheme : "animate"

---

# Animations with Reveal.js and SVG.js

<small>Created by <a href="http://www.telematique.eu" >Asvin Goel</a></small>

::: block {data-animate data-src="heart.svg" }
<!--
{
"setup": [
{
"element": "#heart", 
"modifier": "function() { this.animate(1500).ease('<>').scale(.9).loop(true,true);}"
}
]
}
-->

:::


---


# Monty hall problem

<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>

::: block {data-animate data-src="decisiontree.svg" }
<!--
{ "setup": [
{ "element": "#Price", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "0"} ] },
{ "element": "#Host1", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "1"} ] },
{ "element": "#Choice11", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "2"} ] },
{ "element": "#Choice12", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "3"} ] },
{ "element": "#Host2", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "4"} ] },
{ "element": "#Choice2", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "5"} ] },
{ "element": "#Host3", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "6"} ] },
{ "element": "#Choice3", "modifier": "attr", "parameters": [ {"class": "fragment", "data-fragment-index": "7"} ] }
]}
-->

:::

---

<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>
<span class="fragment"></span>

::: block {data-animate data-src="linear_program.svg" }
<!--
{
"setup": [
{
"element": "#x_geq_0", 
"modifier": "attr",
"parameters": [ { "class": "fragment", "data-fragment-index": "0" } ]
},
{
"element": "#y_geq_0", 
"modifier": "attr",
"parameters": [ { "class": "fragment", "data-fragment-index": "1" } ]
},
{
"element": "#x_leq_4", 
"modifier": "attr",
"parameters": [ { "class": "fragment", "data-fragment-index": "2" } ]
},
{
"element": "#y_leq_6", 
"modifier": "attr",
"parameters": [ { "class": "fragment", "data-fragment-index": "3" } ]
},
{
"element": "#sum_3x_2y_leq_18", 
"modifier": "attr",
"parameters": [ { "class": "fragment", "data-fragment-index": "4" } ]
}
]
}
-->
:::
 
<!--
<button onclick="RevealAnimate.play();this.blur();return false;">Play</button>
<button onclick="RevealAnimate.pause();this.blur();return false;">Pause</button>
<button onclick="RevealAnimate.seek(500);this.blur();return false;">Seek 500</button>
-->


---

## Graphical solution procedure

<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>

::: block {data-animate data-src="linear_program.svg" }
<!--
{
"setup": [
{
"element": "text:not([id])", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "path",
"parameters": [ { "id": "objective", "d": "M 0,60 L 800,540",  "stroke": "firebrick", "stroke-width": 5 } ]
},
{
"modifier": "text",
"parameters": [ "3x+5y = 15", { "id": "sum_3x_5y_is_15", "opacity": "1", "x": "20", "y": "575", "font-size": "50", "font-family": "Times New Roman", "font-style": "italic", "fill": "firebrick" } ]
},
{
"modifier": "text",
"parameters": [ "3x+5y = 0", { "id": "sum_3x_5y_is_0", "opacity": "0", "x": "20", "y": "575", "font-size": "50", "font-family": "Times New Roman", "font-style": "italic", "fill": "firebrick" } ]
},
{
"modifier": "text",
"parameters": [ "3x+5y = 40", { "id": "sum_3x_5y_is_40", "opacity": "0", "x": "20", "y": "575", "font-size": "50", "font-family": "Times New Roman", "font-style": "italic", "fill": "firebrick" } ]
},
{
"modifier": "text",
"parameters": [ "3x+5y = 36", { "id": "sum_3x_5y_is_36", "opacity": "0", "x": "20", "y": "575", "font-size": "50", "font-family": "Times New Roman", "font-style": "italic", "fill": "firebrick" } ]
},
{
"modifier": "circle",
"parameters": [ { "id": "solution", "opacity": "0", "cx": 500, "cy": 150, "r": 10, "fill": "firebrick"} ]
}],
"animation": [
[],
[
{
"element": "#sum_3x_5y_is_15", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#objective", 
"modifier": "attr",
"duration": 1500,
"parameters": [ { "d": "M 0,210 L 800,690" } ]
},
{
"element": "#sum_3x_5y_is_0", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[{
"element": "#sum_3x_5y_is_0", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#objective", 
"modifier": "attr",
"duration": 4000,
"parameters": [ { "d": "M 0,-190 L 800,290" } ]
},
{
"element": "#sum_3x_5y_is_40", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[{
"element": "#sum_3x_5y_is_40", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#objective", 
"modifier": "attr",
"duration": 400,
"parameters": [ { "d": "M 0,-150 L 800,330" } ]
},
{
"element": "#sum_3x_5y_is_36", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[{
"element": "#solution",
"modifier": "opacity",
"parameters": [ 1 ]
}]
]
}
-->
:::
<!--
<button onclick="RevealAnimate.play();this.blur();return false;">Play</button>
<button onclick="RevealAnimate.pause();this.blur();return false;">Pause</button>
<button onclick="RevealAnimate.seek(500);this.blur();return false;">Seek 500</button>
-->

---


## Multiple corner point solutions

::: block {data-animate data-src="linear_program.svg" }
<!--
{
"setup": [
{
"element": "text:not([id])", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "path",
"parameters": [ { "id": "objective", "d": "M 0,-150 L 800,330", "stroke": "firebrick", "stroke-width": 5 } ]
},
{
"modifier": "circle",
"parameters": [ { "id": "solution", "opacity": "1", "cx": 500, "cy": 150, "r": 10, "fill": "firebrick"} ]
},
{
"modifier": "circle",
"parameters": [ { "id": "solution2", "opacity": "0", "cx": 600, "cy": 210, "r": 10, "fill": "firebrick"} ]
}],
"animation": [
[
{
"element": "#solution", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#sum_3x_2y_leq_18 > #boundary", 
"modifier": "attr",
"duration": 2000,
"delay": 400,
"when": "now",
"parameters": [ { "d": "M 200,-30 L 800,330" } ]
},
{
"element": "#sum_3x_2y_leq_18 > #infeasible", 
"modifier": "attr",
"duration": 2000,
"delay": 400,
"when": "now",
"parameters": [ { "d": "M 200,-30 L 800,0 L 800,330" } ]
},
{
"element": "#solution", 
"modifier": "opacity",
"delay": 2400,
"when": "now",
"parameters": [ 1 ]
},
{
"element": "#solution2", 
"modifier": "opacity",
"delay": 2400,
"when": "now",
"parameters": [ 1 ]
}
]
]
}
-->
:::

---

## Simplex algorithm
    
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>

::: block {data-animate data-src="linear_program.svg" }
<!--
{
"setup": [
{
"element": "text:not([id])", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "group",
"parameters": [ { "id": "directions1", "opacity": "0" } ]
},
{
"element": "#directions1", 
"modifier": "path",
"parameters": [ { "d": "M 400,450 L 400,350", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions1", 
"modifier": "path",
"parameters": [ { "d": "M 400,350 L 410,370 L 390,370 L 400,350", "fill": "black"} ]
},
{
"element": "#directions1", 
"modifier": "path",
"parameters": [ { "d": "M 400,450 L 500,450", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions1", 
"modifier": "path",
"parameters": [ { "d": "M 500,450 L 480,440 L 480,460 L 500,450", "fill": "black"} ]
},
{
"modifier": "group",
"parameters": [ { "id": "directions2", "opacity": "0" } ]
},
{
"element": "#directions2", 
"modifier": "path",
"parameters": [ { "d": "M 400,150 L 400,250", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions2", 
"modifier": "path",
"parameters": [ { "d": "M 400,250 L 410,230 L 390,230 L 400,250", "fill": "black"} ]
},
{
"element": "#directions2", 
"modifier": "path",
"parameters": [ { "d": "M 400,150 L 500,150", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions2", 
"modifier": "path",
"parameters": [ { "d": "M 500,150 L 480,140 L 480,160 L 500,150", "fill": "black"} ]
},
{
"modifier": "group",
"parameters": [ { "id": "directions3", "opacity": "0" } ]
},
{
"element": "#directions3", 
"modifier": "path",
"parameters": [ { "d": "M 500,150 L 400,150", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions3", 
"modifier": "path",
"parameters": [ { "d": "M 400,150 L 420,160 L 420,140 L 400,150", "fill": "black"} ]
},
{
"element": "#directions3", 
"modifier": "path",
"parameters": [ { "d": "M 500,150 L 500,250", "transform": "rotate(326 500 150)", "stroke": "black", "stroke-width": 5} ]
},
{
"element": "#directions3", 
"modifier": "path",
"parameters": [ { "d": "M 500,250 L 490,230 L 510,230 L 500,250", "transform": "rotate(326 500 150)", "fill": "black"} ]
},
{
"modifier": "group",
"parameters": [ { "id": "current" } ]
},
{
"element": "#current", 
"modifier": "group",
"parameters": [ { "id": "focus" } ]
},
{
"element": "#focus", 
"modifier": "circle",
"parameters": [ { "id": "shadow", "opacity": "0.7", "cx": 400, "cy": 450, "r": 500, "fill": "none", "stroke": "black", "stroke-width": 800} ]
},
{
"element": "#focus", 
"modifier": "circle",
"parameters": [ { "id": "solution", "opacity": "1", "cx": 400, "cy": 450, "r": 10, "fill": "firebrick"} ]
},
{
"element": "#current", 
"modifier": "line",
"parameters": [ { "id": "objective", "x1": 0, "y1": 210, "x2": 800, "y2": 690, "stroke": "firebrick", "stroke-width": 5 } ]
}
],
"animation": [
[],
[
{
"element": "#directions1", 
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}
],[
{
"element": "#objective", 
"modifier": "dy",
"duration": 1000,
"parameters": [ -100 ]
}
],[
{
"element": "#directions1", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#focus", 
"modifier": "dy",
"duration": 1000,
"parameters": [ -100 ]
},
{
"element": "#current", 
"modifier": "dy",
"duration": 2000,
"parameters": [ -200 ]
}
],[
{
"element": "#directions2", 
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}
],[
{
"element": "#objective", 
"modifier": "dx",
"duration": 1000,
"parameters": [ 100 ]
}
],[
{
"element": "#directions2", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#focus", 
"modifier": "dx",
"duration": 1000,
"parameters": [ 100 ]
}
],[
{
"element": "#directions3", 
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}
],[
{
"element": "#directions3", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#shadow", 
"modifier": "opacity",
"duration": 2000,
"parameters": [ 0 ]
}
]
]
}
-->
:::

---

## Linear relaxation and rounding

<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"></span>

::: block {data-animate data-src="integer_program.svg" }

<!--
{
"setup": [
{
"element": "#objective", 
"modifier": "dy",
"parameters": [ -205 ]
},
{
"modifier": "circle",
"parameters": [ { "id": "relaxation" ,"cx": 530, "cy": 250, "r": 7.5, "fill": "firebrick"} ]
},
{
"modifier": "text",
"parameters": [ "8.2", { "x": 505, "y": 180, "fill": "firebrick", "font-size": 40, "font-family": "Times New Roman", "font-weight": "bold" } ]
},
{
"modifier": "text",
"parameters": [ "4.0", { "id": "closest", "opacity": 0, "x": 525, "y": 285, "fill": "black", "font-size": 40, "font-family": "Times New Roman", "font-weight": "bold" } ]
},
{
"modifier": "group",
"parameters": [ { "id": "next", "opacity": 0 } ]
},
{
"element": "#next",
"modifier": "text",
"parameters": [ "5.0", { "x": 450, "y": 340, "fill": "black", "font-size": 40, "font-family": "Times New Roman", "font-weight": "bold" } ]
},
{
"element": "#next",
"modifier": "text",
"parameters": [ "3.0", { "x": 595, "y": 340, "fill": "black", "font-size": 40, "font-family": "Times New Roman", "font-weight": "bold" } ]
},
{
"modifier": "text",
"parameters": [ "6.0", { "id": "optimal", "opacity": 0, "x": 350, "y": 340, "fill": "firebrick", "font-size": 40, "font-family": "Times New Roman", "font-weight": "bold" } ]
},
{
"modifier": "circle",
"parameters": [ { "id": "solution", "opacity": 0, "cx": 350, "cy": 350, "r": 7.5, "fill": "firebrick"} ]
},
{
"modifier": "circle",
"parameters": [ { "id": "focus", "opacity": 0.7, "cx": 530, "cy": 250, "r": 510, "fill":"none", "stroke": "black", "stroke-width": 900} ]
}
],
"animation": [
[],
[
{
"element": "#focus",
"modifier": "attr",
"duration": 1000,
"parameters": [ { "r": 560} ]
},
{
"element": "#closest",
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[
{
"element": "#focus",
"modifier": "attr",
"duration": 1000,
"parameters": [ { "r": 635} ]
},
{
"element": "#next",
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[
{
"element": "#focus",
"modifier": "attr",
"duration": 1000,
"parameters": [ { "r": 700} ]
},
{
"element": "#optimal",
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[
{
"element": "#focus",
"modifier": "opacity",
"duration": 2000,
"parameters": [ 0 ]
}
]
]
}
-->
:::

---

## Integer enumeration

::: block {data-animate data-src="integer_program.svg" }
<!--
{
"setup": [
{
"element": "#objective", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#feasible", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "function() {var clone = this.findOne('#points').clone(); clone.attr({'id': 'enumeration'}); clone.addTo(this);}"
},
{
"element": "#enumeration > circle", 
"modifier": "attr",
"parameters": [ { "opacity": 0, "r": 7.5, "fill": "black"} ]
}
],
"animation": [
[{
"element": "#enumeration > circle", 
"modifier": "opacity",
"parameters": [ 1 ]
}]
]
}
-->
:::

---

## Branch and bound

<div style="min-height: 1.5em">
    <span class="fragment step-fade-in-then-out">Solution: $(x,y) = (3.8,3)$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$ ⟶ $(x,y) = (4,2.9)$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$, $y \geq 3$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$, $y \geq 3$ ⟶ infeasible</span>
    <span class="fragment step-fade-in-then-out">Discard branch: $x \geq 4$, $y \geq 3$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$, $y \leq 2$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \geq 4$, $y \leq 2$ ⟶ $(x,y) = (4,2)$</span>
    <span class="fragment step-fade-in-then-out">$(x,y) = (4,2)$ is an integer solution</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$ ⟶ $(x,y) = (3,2.6)$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \geq 3$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \geq 3$ ⟶ infeasible</span>
    <span class="fragment step-fade-in-then-out">Discard branch: $x \leq 3$, $y \geq 3$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \leq 2$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \leq 2$ ⟶ $(x,y) = (1.8,2)$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \leq 2$, $x \geq 2$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \leq 2$, $x \geq 2$⟶ $(x,y) = (2,2)$</span>
    <span class="fragment step-fade-in-then-out">$(x,y) = (2,2)$ is an integer solution</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \geq 3$, $x \leq 1$</span>
    <span class="fragment step-fade-in-then-out">Branch $x \leq 3$, $y \geq 3$, $x \leq 1$ ⟶ $(x,y) = (1,1.6)$</span>
    <span class="fragment step-fade-in-then-out">$(x,y) = (1,1.6)$ is worse than best integer solution</span>
    <span class="fragment step-fade-in-then-out">All branches solved, $(x,y) = (2,2)$ is optimal</span>
</div>
<div data-animate data-src="branch_and_bound.svg">
<!--
{
"animation": [
[],
[{
"element": "#solution_root", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#infeasible_x_3_4", 
"modifier": "opacity",
"delay": 2000,
"duration": 1000,
"parameters": [ 1 ]
}],
[{
"element": "#branch_x_geq_4", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#solution_root", 
"modifier": "opacity",
"parameters": [ 0 ]
}
],
[{
"element": "#solution_x_geq_4", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#infeasible_y_2_3", 
"delay": 2000,
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}],
[{
"element": "#branch_x_any_y_geq_3", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#solution_x_geq_4", 
"modifier": "opacity",
"parameters": [ 0 ]
}],
[],
[{
"element": "#branch_x_any_y_geq_3", 
"modifier": "opacity",
"delay": 2000,
"duration": 1000,
"parameters": [ 0 ]
}],
[{
"element": "#branch_x_any_y_leq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
}],
[{
"element": "#solution_x_geq_4_y_leq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
}],
[
{
"element": "#branch_x_any_y_leq_2", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#branch_x_geq_4", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#infeasible_y_2_3", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#solution_x_geq_4_y_leq_2 > line", 
"modifier": "opacity",
"parameters": [ 0 ]
}
],
[{
"element": "#branch_x_leq_3", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[{
"element": "#solution_x_leq_3", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#infeasible_y_2_3", 
"delay": 2000,
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}],
[{
"element": "#branch_x_any_y_geq_3", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#solution_x_leq_3", 
"modifier": "opacity",
"parameters": [ 0 ]
}],
[],
[{
"element": "#branch_x_any_y_geq_3", 
"modifier": "opacity",
"delay": 2000,
"duration": 1000,
"parameters": [ 0 ]
}],
[{
"element": "#branch_x_any_y_leq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
}],
[{
"element": "#solution_x_leq_3_y_leq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#infeasible_x_1_2", 
"delay": 2000,
"modifier": "opacity",
"duration": 1000,
"parameters": [ 1 ]
}],
[{
"element": "#branch_x_leq_3_y_leq_2_x_geq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
},
{
"element": "#solution_x_leq_3_y_leq_2", 
"modifier": "opacity",
"parameters": [ 0 ]
}],
[
{
"element": "#solution_x_leq_3_y_leq_2_x_geq_2", 
"modifier": "opacity",
"parameters": [ 1 ]
}],
[
{
"element": "#branch_x_leq_3_y_leq_2_x_geq_2", 
"modifier": "opacity",
"parameters": [ 0 ]
},{
"element": "#solution_x_leq_3_y_leq_2_x_geq_2 > line", 
"modifier": "opacity",
"parameters": [ 0 ]
}
],
[
{
"element": "#branch_x_leq_3_y_leq_2_x_leq_1", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[
{
"element": "#solution_x_leq_3_y_leq_2_x_leq_1", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[
{
"element": "#solution_x_leq_3_y_leq_2_x_leq_1", 
"modifier": "opacity",
"parameters": [ 0 ]
}

],
[
{
"element": "#branch_x_leq_3_y_leq_2_x_leq_1", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#branch_x_any_y_leq_2", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#branch_x_leq_3", 
"modifier": "opacity",
"parameters": [ 0 ]
}
]
]
}
-->
		
---

## Big-M constraint

<div style="min-height: 1.5em">$y \leq 1 + M(1-z)$ with $z=1$</div>
<div data-animate data-src="integer_program.svg">
<!--
{
"setup": [
{
"element": "#objective", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "group",
"parameters": [ { "id": "conditional" } ]
},
{
"element": "g#conditional", 
"modifier": "rect",
"parameters": [ { "x1": 0, "y1": 0, "width": 800, "height": 450, "fill": "BlueViolet", "fill-opacity": 0.4 } ]
},
{
"element": "g#conditional", 
"modifier": "line",
"parameters": [ { "x1": 0, "y1": 450, "x2": 800, "y2": 450, "stroke": "BlueViolet", "stroke-width": 5 } ]
}
]
}
-->
</div>

---

<!-- Fake animation between slides using reveal.js transitions -->
			
## Big-M constraint
<div style="min-height: 1.5em">$y \leq 1 + M(1-z)$ with $z=0$
<span class="fragment step-fade-in-then-out"></span>
<span class="fragment step-fade-in-then-out"> and sufficiently large $M$</span>
</div>
<div data-animate data-src="integer_program.svg">
<!--
{
"setup": [
{
"element": "#objective", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"modifier": "group",
"parameters": [ { "id": "conditional" } ]
},
{
"element": "g#conditional", 
"modifier": "rect",
"parameters": [ { "x1": 0, "y1": 0, "width": 800, "height": 450, "fill": "BlueViolet", "fill-opacity": 0.4 } ]
},
{
"element": "g#conditional", 
"modifier": "line",
"parameters": [ { "x1": 0, "y1": 450, "x2": 800, "y2": 450, "stroke": "BlueViolet", "stroke-width": 5 } ]
},
{
"modifier": "text",
"parameters": [ "M = 0", { "id": "M0", "x": 480, "y": 450, "font-size": "40", "font-family": "Times New Roman", "font-style": "italic", "fill": "BlueViolet" } ]
},
{
"modifier": "text",
"parameters": [ "M = 2", { "id": "M2", "opacity": 0, "x": 480, "y": 250, "font-size": "40", "font-family": "Times New Roman", "font-style": "italic", "fill": "BlueViolet" } ]
}
],
"animation": [
[],
[
{
"element": "#M0", 
"modifier": "opacity",
"parameters": [ 0 ]
},
{
"element": "#conditional", 
"modifier": "dy",
"duration": 2000,
"parameters": [ -200 ]
},
{
"element": "#M2", 
"modifier": "opacity",
"parameters": [ 1 ]
}
],
[]
]
}
-->
</div>
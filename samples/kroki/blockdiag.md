---
theme: white
---

# blockdiag

http://blockdiag.com/

---

```blockdiag
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
```

---

```blockdiag
blockdiag {
   // Set labels to nodes.
   A [label = "foo"];
   B [label = "bar"];
   // And set text-color
   C [label = "baz"];

   // Set labels to edges. (short text only)
   A -> B [label = "click bar", textcolor="red"];
   B -> C [label = "click baz"];
   C -> A;
}
```

---

```blockdiag
blockdiag {
   // Set boder-style, backgroun-color and text-color to nodes.
   A [style = dotted];
   B [style = dashed];
   C [color = pink, style = "3,3,3,3,15,3"]; //dashed_array format style
   D [color = "#888888", textcolor="#FFFFFF"];

   // Set border-style and color to edges.
   A -> B [style = dotted];
   B -> C [style = dashed];
   C -> D [color = "red", style = "3,3,3,3,15,3"]; //dashed_array format style

   // Set numbered-badge to nodes.
   E [numbered = 99];

   // Set background image to nodes (and erase label).
   F [label = "", background = "_static/python-logo.gif"];
   G [label = "", background = "http://blockdiag.com/en/_static/python-logo.gif"];
   H [icon = "_static/help-browser.png"];
   I [icon = "http://blockdiag.com/en/_static/internet-mail.png"];

   // Set arrow direction to edges.
   E -> F [dir = none];
   F -> G [dir = forward];
   G -> H [dir = back];
   H -> I [dir = both];

   // Set width and height to nodes.
   K [width = 192]; // default value is 128
   L [height = 64]; // default value is 40

   // Use thick line
   J -> K [thick]
   K -> L;
}
```


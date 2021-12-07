# Headers

```md
# This is an <h1> tag

## This is an <h2> tag

### This is an <h3> tag

#### This is an <h4> tag

##### This is an <h5> tag

###### This is an <h6> tag
```

--

If you want to add id and class to the header, then simply append {#id .class1 .class2}. For example:

```md
# This heading has 1 id {#my_id}

# This heading has 2 classes {.class1 .class2}
```

---

# Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

~~This text will be strikethrough~~

--

```md
*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

~~This text will be strikethrough~~
```

---

# Lists

--

## Unordered List

- Item 1
- Item 2
  - Item 2a
  - Item 2b

--

## Ordered List

1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b

---

# Images

```md
![GitHub Logo](/images/logo.png)
Format: ![Alt Text](url)
```

---

# Links

https://github.com - automatic!
[GitHub](https://github.com)

---

# Blockquote

As Kanye West said:

> We're living the future so
> the present is our past.

---

# Inline code

I think you should use an
`<addr>` element here instead.

---

# Fenced code block

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

### line-numbers

```javascript {data-line-numbers}
function add(x, y) {
  return x + y
}
```

---

# Task lists

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

---

# Tables

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column
---
title: Bootstrap css
backgroundTransition: slide
css: 
    - https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css

---

# Use bootstrap css

--

## Add css list in config

```yml
---
title: Bootstrap css
css: 
    - https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css
---
```

---

### use badge 


<span class="badge text-bg-primary">Primary</span>
<span class="badge text-bg-secondary">Secondary</span>
<span class="badge text-bg-success">Success</span>
<span class="badge text-bg-danger">Danger</span>
<span class="badge text-bg-warning">Warning</span>
<span class="badge text-bg-info">Info</span>
<span class="badge text-bg-light">Light</span>
<span class="badge text-bg-dark">Dark</span>

<br />
<span class="badge rounded-pill text-bg-primary">Primary</span>
<span class="badge rounded-pill text-bg-secondary">Secondary</span>
<span class="badge rounded-pill text-bg-success">Success</span>
<span class="badge rounded-pill text-bg-danger">Danger</span>
<span class="badge rounded-pill text-bg-warning">Warning</span>
<span class="badge rounded-pill text-bg-info">Info</span>
<span class="badge rounded-pill text-bg-light">Light</span>
<span class="badge rounded-pill text-bg-dark">Dark</span>

<button type="button" class="btn btn-primary">
  Notifications <span class="badge text-bg-secondary">4</span>
</button>

<button type="button" class="btn btn-primary position-relative">
  Inbox
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">unread messages</span>
  </span>
</button>

---

## Use Alert 

<div class="alert alert-primary d-flex align-items-center" role="alert">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
  <div>
    An example alert with an icon
  </div>
</div>


---

## color

<div class="p-3 mb-2 bg-primary text-white">.bg-primary</div>
<div class="p-3 mb-2 bg-secondary text-white">.bg-secondary</div>
<div class="p-3 mb-2 bg-success text-white">.bg-success</div>
<div class="p-3 mb-2 bg-danger text-white">.bg-danger</div>
<div class="p-3 mb-2 bg-warning text-dark">.bg-warning</div>
<div class="p-3 mb-2 bg-info text-dark">.bg-info</div>
<div class="p-3 mb-2 bg-light text-dark">.bg-light</div>
<div class="p-3 mb-2 bg-dark text-white">.bg-dark</div>

---

## Gradient

<div class="p-3 mb-2 bg-primary bg-gradient text-white">.bg-primary.bg-gradient</div>

<div class="p-3 mb-2 bg-secondary bg-gradient text-white">.bg-secondary.bg-gradient</div>

<div class="p-3 mb-2 bg-success bg-gradient text-white">.bg-success.bg-gradient</div>
<div class="p-3 mb-2 bg-danger bg-gradient text-white">.bg-danger.bg-gradient</div>
<div class="p-3 mb-2 bg-warning bg-gradient text-dark">.bg-warning.bg-gradient</div>

---

## border

<span class="border border-primary">primary</span>
<span class="border border-secondary">secondary</span>
<span class="border border-success">success</span>
<span class="border border-danger">danger</span>
<span class="border border-warning">warning</span>
<span class="border border-info">info</span>
<span class="border border-light">light</span>
<span class="border border-dark">dark</span>
<span class="border border-white">white</span>

---

## Text

<p class="text-primary">.text-primary</p>
<p class="text-secondary">.text-secondary</p>
<p class="text-success">.text-success</p>
<p class="text-danger">.text-danger</p>
<p class="text-warning bg-dark">.text-warning</p>
<p class="text-info bg-dark">.text-info</p>
<p class="text-light bg-dark">.text-light</p>
<p class="text-dark">.text-dark</p>
<p class="text-body">.text-body</p>
<p class="text-muted">.text-muted</p>
<p class="text-white bg-dark">.text-white</p>
<p class="text-black-50">.text-black-50</p>
<p class="text-white-50 bg-dark">.text-white-50</p>

---

## card (in grid 3 cols)

::: {.grid style="--cols-xs: 3; --cols-sm: 3; --cols-md: 3; --cols-lg: 3; --cols-xl: 3;"}

<div class="card text-black-50" style="width: 18rem;">
  <img src="https://via.placeholder.com/200x150" class="card-img-top" style="margin:0;max-width: 100%;">
  <div class="card-body">
    <h5 class="card-title text-black-50">title</h5>
    <p class="card-text">content</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-black-50" style="width: 18rem;">
  <img src="https://via.placeholder.com/200x150" class="card-img-top" style="margin:0;max-width: 100%;">
  <div class="card-body">
    <h5 class="card-title text-black-50">title</h5>
    <p class="card-text">content</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-black-50" style="width: 18rem;">
  <img src="https://via.placeholder.com/200x150" class="card-img-top" style="margin:0;max-width: 100%;">
  <div class="card-body">
    <h5 class="card-title text-black-50">title</h5>
    <p class="card-text">content</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

:::

---

<!-- .slide: class="bg-primary" -->

# primary

--

<!-- .slide: class="bg-secondary" -->

# secondary

--

<!-- .slide: class="bg-success" -->

# success

--

<!-- .slide: class="bg-danger" -->

# danger

--

<!-- .slide: class="bg-warning" -->

# warning

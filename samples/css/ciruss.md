---
title: Cirrus css
enableMenu: false
css:
 - https://cdn.jsdelivr.net/npm/cirrus-ui/dist/cirrus.min.css

---

# Use Cirrus CSS

---


## Add css list in config

```yml
---
title: Cirrus css
css: 
    - https://cdn.jsdelivr.net/npm/cirrus-ui/dist/cirrus.min.css
---
```

---

## Color 

::: grid
<div class="bg-primary u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-light u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-dark u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-link u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-link-dark u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-info u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-success u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-warning u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-danger u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-white u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>
<div class="bg-black u-round-xs mx-auto" style="height: 50px; width: 50px;"></div>

:::

--

<!-- .slide: class="bg-primary" -->

# primary

--

<!-- .slide: class="bg-link" -->

# link

--

<!-- .slide: class="bg-success" -->

# success

---

## Avatar

<div class="avatar"><img style="margin:0;max-height:100%;max-width:100%;" src="https://4501-enterprise.demo.design.infor.com/images/11.jpg" alt="avatar"></div>

<div class="avatar"><img style="margin:0;max-height:100%;max-width:100%;" src="https://4501-enterprise.demo.design.infor.com/images/12.jpg" alt="avatar"></div>

<div class="avatar"><img style="margin:0;max-height:100%;max-width:100%;" src="https://4501-enterprise.demo.design.infor.com/images/13.jpg" alt="avatar"></div>

<div class="avatar"><img style="margin:0;max-height:100%;max-width:100%;" src="https://4501-enterprise.demo.design.infor.com/images/14.jpg" alt="avatar"></div>

<div class="avatar"><img style="margin:0;max-height:100%;max-width:100%;" src="https://4501-enterprise.demo.design.infor.com/images/15.jpg" alt="avatar"></div>

---

<div class="avatar text-gray-000" data-text='Aa'></div>
<div class="avatar avatar--lg text-gray-000" data-text='Bb'></div>
<div class="avatar avatar--xl text-gray-000" data-text='Cc'></div>

---

<div class="card">
<div class="card__container">
<div class="card__image" style="background-image: url(https://images.unsplash.com/photo-1467952497026-86722ef1916f?dpr=1.25&amp;auto=compress,format&amp;fit=crop&amp;w=1199&amp;h=799&amp;q=80&amp;cs=tinysrgb&amp;crop=)"></div>
</div>
<div class="content">
<div class="space"></div>
<div class="tile tile--center">
<div class="tile__icon">
<figure class="avatar">
<img src="https://organicthemes.com/demo/profile/files/2018/05/profile-pic-132x132.jpg" alt="Person">
</figure>
</div>

<div class="tile__container">
<p class="tile__title">Joanne Doe</p>
<p class="tile__subtitle"><a>@jdoe</a></p>
</div>
</div>
<p>Testing my new DSLR. Wow check out that deer! <a href="!#">#nature</a></p>
</div>
<div class="card__footer level content">
6:32 PM - 3 Jul 18
<div class="u-pull-right">
<div class="level-right">
<a class="level-item">
<span class="icon"><i class="fa fa-wrapper small fa-reply" aria-hidden="true"></i></span>
</a>
<a class="level-item">
<span class="icon"><i class="fa fa-wrapper small fa-retweet" aria-hidden="true"></i></span>
</a>
<a class="level-item">
<span class="icon"><i class="fa fa-wrapper small fa-heart" aria-hidden="true"></i></span>
</a>
</div>
</div>
</div>
</div>

---

<ul class="menu">
<li class="menu-item selected"><a href="!#">One</a></li>
<li class="menu-item"><a href="!#">Two</a></li>
<li class="menu-item"><a href="!#">Three</a></li>
</ul>

---

<progress class="progress progress--xl" value="15" max="100">15%</progress>

---

<table class="table">
<thead>
<tr>
<th><abbr title="Title1">T1</abbr></th>
<th><abbr title="Title2">T2</abbr></th>
<th><abbr title="Title3">T3</abbr></th>
<th><abbr title="Title4">T4</abbr></th>
<th><abbr title="Title5">T5</abbr></th>
<th><abbr title="Short">S</abbr></th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<th>1</th>
<td>Row:1 Cell:1</td>
<td>Row:1 Cell:2</td>
<td>Row:1 Cell:3</td>
<td>Row:1 Cell:4</td>
<td>S</td>
<td>Row:1 Cell:5</td>
</tr>
<tr>
<th>2</th>
<td>Row:2 Cell:1</td>
<td>Row:2 Cell:2</td>
<td>Row:2 Cell:3</td>
<td>Row:2 Cell:4</td>
<td>S</td>
<td>Row:2 Cell:5</td>
</tr>
<tr class="selected">
<th>3</th>
<td>Row:3 Cell:1</td>
<td>Row:3 Cell:2</td>
<td>Row:3 Cell:3</td>
<td>Row:3 Cell:4</td>
<td>S</td>
<td>Row:3 Cell:5</td>
</tr>

</tbody>
</table>

---

<div class="tab-container  tabs-fill">
<ul>
<li><div class="tab-item-content">Home</div></li>
<li><div class="tab-item-content">Group</div></li>
<li><div class="tab-item-content">Shop</div></li>
<li class="selected"><div class="tab-item-content">Me</div></li>
</ul>
</div>

---

<div class="tag tag--white">White</div>
<div class="tag tag--black">Dark</div>
<div class="tag tag--primary">Primary</div>
<div class="tag tag--link">Link</div>
<div class="tag tag--info">Info</div>
<div class="tag tag--success">Success</div>
<div class="tag tag--warning">Warning</div>
<div class="tag tag--danger">Danger</div>

---

<div class="py-2 u-text-center">
    <div class="tag tag--xs bg-orange-100">Extra Small</div>
    <div class="tag tag--sm bg-orange-200">Small</div>
    <div class="tag tag--md bg-orange-300">Medium</div>
    <div class="tag tag--lg bg-orange-400">Large</div>
    <div class="tag tag--xl bg-orange-500">Extra Large</div>
</div>

---

<div class="tag-container group-tags">
    <div class="tag tag--xs tag--dark">xs</div>
    <div class="tag tag--xs tag--info">0.6.0</div>
    <div class="tag tag--xs tag--warning tag__close-btn"></div>
</div>
<div class="tag-container group-tags">
    <div class="tag tag--sm tag--dark">sm</div>
    <div class="tag tag--sm tag--info">0.6.0</div>
    <div class="tag tag--sm tag--warning tag__close-btn"></div>
</div>
<div class="tag-container group-tags">
    <div class="tag tag--md tag--dark">md</div>
    <div class="tag tag--md tag--info">0.6.0</div>
    <div class="tag tag--md tag--warning tag__close-btn"></div>
</div>
<div class="tag-container group-tags">
    <div class="tag tag--lg tag--dark">lg</div>
    <div class="tag tag--lg tag--info">0.6.0</div>
    <div class="tag tag--lg tag--warning tag__close-btn"></div>
</div>
<div class="tag-container group-tags">
    <div class="tag tag--xl tag--dark">xl</div>
    <div class="tag tag--xl tag--info">0.6.0</div>
    <div class="tag tag--xl tag--warning tag__close-btn"></div>
</div>

<div class="tag-container group-tags group-tags--rounded">
    <div class="tag tag--dark">Version</div>
    <div class="tag tag--info">0.6.0</div>
    <div class="tag tag--warning tag__close-btn"></div>
</div>

---

<div class="col-lg-6">
    <div class="toast toast--success">
        <button class="btn-close"></button>
        <p>Success</p>
    </div>
    <div class="toast toast--warning">
        <button class="btn-close"></button>
        <p>Warning</p>
    </div>
    <div class="toast toast--danger">
        <button class="btn-close"></button>
        <p>Error</p>
    </div>
    <div class="toast toast--info">
        <button class="btn-close"></button>
        <p>Info</p>
    </div>
    <div class="toast toast--link">
        <button class="btn-close"></button>
        <p>Link</p>
    </div>
    <div class="toast toast--primary">
        <button class="btn-close"></button>
        <p>Primary</p>
    </div>
    <div class="toast toast--gray">
        <button class="btn-close"></button>
        <p>Gray</p>
    </div>
    <div class="toast toast--dark">
        <button class="btn-close"></button>
        <p>Dark</p>
    </div>
</div>

---

<div class="tree">
    <div class="tree-item">
        <input type="checkbox" id="tree1" class="u-none">
        <label class="tree-item-header" for="tree1">
            <span class="icon">
                                    <i class="fa fa-wrapper fa-chevron-right small" aria-hidden="true"></i>
                                </span> Trees
        </label>
        <div class="tree-item-body">
            <ul class="menu">
                <li class="menu-item"><a href="!#">Oak</a></li>
                <li class="menu-item"><a href="!#">Birch</a></li>
                <li class="menu-item">
                    <div class="tree">
                        <input type="checkbox" id="tree2" class="u-none">
                        <label class="tree-item-header" for="tree2">
                            <span class="icon">
                                                    <i class="fa fa-wrapper fa-chevron-right small" aria-hidden="true"></i>
                                                </span> Evergreens
                        </label>
                        <div class="tree-item-body">
                            <ul class="menu">
                                <li class="menu-item"><a href="!#">Cedar</a></li>
                                <li class="menu-item"><a href="!#">Loblolly Pine</a></li>
                                <li class="menu-item"><a href="!#">Pitch Pine</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="tree">
    <div class="tree-item">
        <input type="checkbox" id="tree3" class="u-none">
        <label class="tree-item-header" for="tree3">
            <span class="icon">
                                    <i class="fa fa-wrapper fa-chevron-right small" aria-hidden="true"></i>
                                </span> Fruits
        </label>
        <div class="tree-item-body">
            <ul class="menu">
                <li class="menu-item"><a href="!#">Mangosteen</a></li>
                <li class="menu-item"><a href="!#">Durian</a></li>
                <li class="menu-item"><a href="!#">Jabuticaba</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="tree">
    <div class="tree-item">
        <input type="checkbox" id="tree4" class="u-none">
        <label class="tree-item-header" for="tree4">
            <span class="icon">
                                    <i class="fa fa-wrapper fa-chevron-right small" aria-hidden="true"></i>
                                </span> Flowers
        </label>
        <div class="tree-item-body">
            <ul class="menu">
                <li class="menu-item"><a href="!#">Jade Vine</a></li>
                <li class="menu-item"><a href="!#">Ghost Orchid</a></li>
                <li class="menu-item"><a href="!#">Corpse Flower</a></li>
            </ul>
        </div>
    </div>
</div>

---

:: {.div .u-text-left}

<div class="col-lg-6">
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-dark" class="form-ext-input form-ext-input--dark" type="checkbox" checked />
        <label class="form-ext-label" for="check-dark">dark</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-primary" class="form-ext-input form-ext-input--primary" type="checkbox" checked />
        <label class="form-ext-label" for="check-primary">primary</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-link" class="form-ext-input form-ext-input--link" type="checkbox" checked />
        <label class="form-ext-label" for="check-link">link</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-info" class="form-ext-input form-ext-input--info" type="checkbox" checked />
        <label class="form-ext-label" for="check-info">info</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-success" class="form-ext-input form-ext-input--success" type="checkbox" checked />
        <label class="form-ext-label" for="check-success">success</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-warning" class="form-ext-input form-ext-input--warning" type="checkbox" checked />
        <label class="form-ext-label" for="check-warning">warning</label>
    </div>
    <div class="form-ext-control form-ext-checkbox">
        <input id="check-danger" class="form-ext-input form-ext-input--danger" type="checkbox" checked />
        <label class="form-ext-label" for="check-danger">danger</label>
    </div>
</div>

:::


---

<div class="form-ext-control form-ext-radio">
    <input id="check-dark" class="form-ext-input form-ext-input--dark" type="checkbox" checked />
    <label class="form-ext-label" for="check-dark">dark</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-primary" class="form-ext-input form-ext-input--primary" type="checkbox" checked />
    <label class="form-ext-label" for="check-primary">primary</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-link" class="form-ext-input form-ext-input--link" type="checkbox" checked />
    <label class="form-ext-label" for="check-link">link</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-info" class="form-ext-input form-ext-input--info" type="checkbox" checked />
    <label class="form-ext-label" for="check-info">info</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-success" class="form-ext-input form-ext-input--success" type="checkbox" checked />
    <label class="form-ext-label" for="check-success">success</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-warning" class="form-ext-input form-ext-input--warning" type="checkbox" checked />
    <label class="form-ext-label" for="check-warning">warning</label>
</div>
<div class="form-ext-control form-ext-radio">
    <input id="check-danger" class="form-ext-input form-ext-input--danger" type="checkbox" checked />
    <label class="form-ext-label" for="check-danger">danger</label>
</div>

---

<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>dark</span>
        <div class="form-ext-toggle form-ext-toggle--dark">
            <input name="toggleCheckbox-dark" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>primary</span>
        <div class="form-ext-toggle form-ext-toggle--primary">
            <input name="toggleCheckbox-primary" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>link</span>
        <div class="form-ext-toggle form-ext-toggle--link">
            <input name="toggleCheckbox-link" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>info</span>
        <div class="form-ext-toggle form-ext-toggle--info">
            <input name="toggleCheckbox-info" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>success</span>
        <div class="form-ext-toggle form-ext-toggle--success">
            <input name="toggleCheckbox-success" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>warning</span>
        <div class="form-ext-toggle form-ext-toggle--warning">
            <input name="toggleCheckbox-warning" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>
<div class="form-ext-control">
    <label class="form-ext-toggle__label"><span>danger</span>
        <div class="form-ext-toggle form-ext-toggle--danger">
            <input name="toggleCheckbox-danger" type="checkbox" class="form-ext-input" checked />
            <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
    </label>
</div>

---

<div class="hero bg-indigo-600">
    <div class="hero-body">
        <div class="content">
            <h2 class="title text-white">I am the title.</h2>
            <h5 class="subtitle text-gray-300">And I am the subtitle.</h5></div>
    </div>
</div>

---

<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-xs"></div>
    <p><b>u-round-xs</b></p>
</div>
<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-sm"></div>
    <p><b>u-round-sm</b></p>
</div>
<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-md"></div>
    <p><b>u-round-md</b></p>
</div>
<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-lg"></div>
    <p><b>u-round-lg</b></p>
</div>
<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-xl"></div>
    <p><b>u-round-xl</b></p>
</div>
<div class="col-4 u-text-center">
    <div class="p-4 bg-purple-500 u-shadow-lg u-round-full"></div>
    <p><b>u-round-full</b></p>
</div>

---

<div class="bg-gray-000 u-round-xs row u-gap-2 p-4 u-justify-center">
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-none u-text-center"><span class="font-bold">none</span></div>
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-xs u-text-center"><span class="font-bold">xs</span></div>
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-sm u-text-center"><span class="font-bold">sm</span></div>
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-md u-text-center"><span class="font-bold">md</span></div>
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-lg u-text-center"><span class="font-bold">lg</span></div>
    <div class="bg-gray-200 u-round-xs p-4 u-shadow-xl u-text-center"><span class="font-bold">xl</span></div>
</div>

---


<span class="icon subtitle" style="font-size: 5em">
    <i class="fab fa-wrapper fa-github"></i>
</span>

---

<h1 class="uppercase">this is h1<span class="desc"><code>h1</code> 3rem (48px)</span></h1>
<h2 class="uppercase">this is h2<span class="desc"><code>h2</code> 2.5rem (40px)</span></h2>
<h3 class="uppercase">this is h3<span class="desc"><code>h3</code> 2rem (32px)</span></h3>
<h4 class="uppercase">this is h4<span class="desc"><code>h4</code> 1.75rem (24px)</span></h4>
<h5 class="uppercase">this is h5<span class="desc"><code>h5</code> 1.5rem (16px)</span></h5>
<h6 class="uppercase">this is h6<span class="desc"><code>h6</code> 1.25rem (12px)</span></h6>

---

<h1 class="font-alt font-light uppercase">this is h1<span class="desc"><code>h1</code> 3rem (48px)</span></h1>
<h2 class="font-alt font-light uppercase">this is h2<span class="desc"><code>h2</code> 2.5rem (40px)</span></h2>
<h3 class="font-alt font-light uppercase">this is h3<span class="desc"><code>h3</code> 2rem (32px)</span></h3>
<h4 class="font-alt font-light uppercase">this is h4<span class="desc"><code>h4</code> 1.75rem (24px)</span></h4>
<h5 class="font-alt font-light uppercase">this is h5<span class="desc"><code>h5</code> 1.5rem (16px)</span></h5>
<h6 class="font-alt font-light uppercase">this is h6<span class="desc"><code>h6</code> 1.25rem (12px)</span></h6>
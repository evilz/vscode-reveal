Custom controls with Reveal.js
==============================

Created by [Asvin Goel](http://www.telematique.eu)

---

The plugin allows to add custom controls to Reveal.js.

--

Sample configuration
--------------------

    
    Reveal.initialize({
      // ...
      customcontrols: {
        controls: [
          {
            id: 'toggle-overview',
            title: 'Toggle overview (O)',
            icon: '',
            action: 'Reveal.toggleOverview();'
          },
          {
            icon: '',
            title: 'Toggle chalkboard (B)',
            action: 'RevealChalkboard.toggleChalkboard();'
          },
          {
            icon: '',
            title: 'Toggle notes canvas (C)',
            action: 'RevealChalkboard.toggleNotesCanvas();'
          }
        ]
      },
      // ...
    });
    
---

The end
-------

Check out other plugins by clicking on  [](#)  and then on "Plugins ".

Have a look at the source code & documentation on [Github](https://github.com/rajgoel/reveal.js-plugins).

[Download](https://github.com/rajgoel/reveal.js-plugins/archive/master.zip) [Star](https://github.com/rajgoel/reveal.js-plugins)
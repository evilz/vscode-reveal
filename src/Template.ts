// tslint:disable-next-line:no-submodule-imports
import md = require('reveal.js/plugin/markdown/markdown')
import { ExtensionOptions, IRevealJsOptions } from './Models'

export const renderRevealHtml = (title: string, extensionOptions: ExtensionOptions, slidesContent: string) => {
  const slides = md.slidify(slidesContent, extensionOptions) as string
  const html = renderTemplate(title, extensionOptions, slides)
  return html
}

const renderTemplate = (title: string, revealOptions: IRevealJsOptions, slides: any): string => {
  return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="stylesheet" href="css/reveal.css">
        <link rel="stylesheet" href="css/theme/${revealOptions.theme}.css" id="theme">
        ${revealOptions.customTheme ? ` <link rel="stylesheet" href="${revealOptions.customTheme}.css" id="theme">` : ''}

        <!-- For syntax highlighting -->
        <link rel="stylesheet" href="lib/css/${revealOptions.highlightTheme}.css">

        ${revealOptions.customHighlightTheme ? `<link rel="stylesheet" href="lib/css/${revealOptions.customHighlightTheme}.css">` : ''}

        <!-- If the query includes 'print-pdf', use the PDF print sheet -->
        <script>
          document.write( '<link rel="stylesheet" href="css/print/' + ( window.location.search.match( /print-pdf/gi ) ? 'pdf' : 'paper' ) + '.css" type="text/css" media="print">' );
        </script>

        <style type="text/css">
            @page {
              margin: 0;
              size: auto;
            }
        </style>

        <script>
         if(window.location.search.match( /print-pdf-now/gi )) {
           window.print();
         }
      </script>

    </head>
    <body>

        <div class="reveal">
            <div class="slides">${slides}</div>
        </div>

        <script src="lib/js/head.min.js"></script>
        <script src="js/reveal.js"></script>

        <script>
            function extend() {
              var target = {};
              for (var i = 0; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                  if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                  }
                }
              }
              return target;
            }
            // Optional libraries used to extend on reveal.js
            var deps = [
              { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
              { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector('[data-markdown]'); } },
              { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector('[data-markdown]'); } },
              { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
              { src: 'plugin/math/math.js', async: true }
            ];

            var extraPlugins = ${JSON.stringify(revealOptions.customPlugins || [])};
            if (!extraPlugins.includes("reveal-code-focus/reveal-code-focus.js")) {
              deps.push({ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } });
            }
            else {
              deps.push({ src: 'plugin/highlight/highlight.js', async: false });
            }

            deps = deps.concat(extraPlugins.map(name => { return { src: "node_modules/" + name, async: false }}));

            // default options to init reveal.js
            var defaultOptions = {
              controls: true,
              progress: true,
              history: true,
              center: true,
              transition: 'default',
              dependencies: deps
            };
            // options from URL query string
            var queryOptions = Reveal.getQueryHash() || {};
            var options = ${JSON.stringify(revealOptions, null, 2)};
            options = extend(defaultOptions, options, queryOptions);
            Reveal.initialize(options);

            window.onload = () => {
              ${revealOptions.customJavascript};
            }
        </script>

    </body>
</html>`
}

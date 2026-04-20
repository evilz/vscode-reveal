/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * Verticator.js for Reveal.js
 * Version 1.1.4
 *
 * @license
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js
 ******************************************************************/

;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory()) : typeof define === 'function' && define.amd ? define(factory) : ((global = global || self), (global.Verticator = factory()))
})(this, function () {
  'use strict'

  var Plugin = function Plugin() {
    var loadStyle = function loadStyle(url, type, callback) {
      var head = document.querySelector('head')
      var style
      style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = url

      var finish = function finish() {
        if (typeof callback === 'function') {
          callback.call()
          callback = null
        }
      }

      style.onload = finish

      style.onreadystatechange = function () {
        if (this.readyState === 'loaded') {
          finish()
        }
      }

      head.appendChild(style)
    }

    var verticate = function verticate(deck, options) {
      var userScale = options.scale
      userScale = userScale > 2 ? 2 : userScale < 0.5 ? 0.5 : userScale
      var revealElement = deck.getRevealElement()
      var theVerticator = revealElement.querySelector('ul.verticator')

      if (!theVerticator) {
        if (!options.autogenerate) return
        var ul = document.createElement('ul')
        ul.className += 'verticator'
        revealElement.insertBefore(ul, revealElement.childNodes[0])
        theVerticator = revealElement.querySelector('ul.verticator')
      }

      if (!options.clickable) {
        theVerticator.classList.add('no-click')
      }

      var revealScale = deck.getScale()
      var totalScale = revealScale > 1 ? revealScale * userScale : userScale
      theVerticator.style.setProperty('--verticator-scale', totalScale.toFixed(2))
      deck.on('resize', function (event) {
        revealScale = event.scale
        totalScale = revealScale > 1 ? revealScale * userScale : userScale
        theVerticator.style.setProperty('--verticator-scale', totalScale.toFixed(2))
      })

      if (options.offset != '3vmin') {
        theVerticator.style.right = options.offset
      }

      if (options.position == 'left') {
        theVerticator.classList.add('left')
        theVerticator.style.right = 'auto'
        theVerticator.style.left = options.offset
      }

      if (options.position != 'left' && options.position != 'right') {
        options.position = 'right'
      }

      var activeclass = 'active'

      var selectionArray = function selectionArray(container, selectors) {
        var selections = container.querySelectorAll(selectors)
        var selectionarray = Array.prototype.slice.call(selections)
        return selectionarray
      }

      var clickBullet = function clickBullet(event) {
        if (event.target.matches('.verticator li a')) {
          var currIndexh = deck.getIndices().h
          var currIndexf = deck.getIndices().v
          var i = getNodeindex(event.target.parentNode)
          event.preventDefault()
          deck.slide(currIndexh, i, currIndexf)
        }
      }

      var activateBullet = function activateBullet(event) {
        var listItems = selectionArray(theVerticator, 'li')

        if (revealElement.classList.contains('has-dark-background')) {
          theVerticator.style.color = options.oppositecolor
          theVerticator.style.setProperty('--bullet-maincolor', options.oppositecolor)
        } else {
          theVerticator.style.color = options.color
          theVerticator.style.setProperty('--bullet-maincolor', options.color)
        }

        if (options.darktheme) {
          if (revealElement.classList.contains('has-light-background')) {
            theVerticator.style.color = options.oppositecolor
            theVerticator.style.setProperty('--bullet-maincolor', options.oppositecolor)
          } else {
            theVerticator.style.color = options.color
            theVerticator.style.setProperty('--bullet-maincolor', options.color)
          }
        }

        var bestMatch = options.indexbase - 1
        listItems.forEach(function (listItem, i) {
          if (parseInt(listItem.getAttribute('data-index')) <= event.indexv + options.indexbase) {
            bestMatch = i
          }

          listItem.classList.remove(activeclass)
        })

        if (bestMatch >= 0) {
          listItems[bestMatch].classList.add(activeclass)
        }
      }

      var ttName = function ttName(element) {
        if ((element.getAttribute('data-verticator-tooltip') && (element.getAttribute('data-verticator-tooltip') == 'none' || element.getAttribute('data-verticator-tooltip') == 'false')) || element.classList.contains('no-verticator-tooltip')) {
          return
        } else if (options.tooltip != 'auto' && element.getAttribute(''.concat(options.tooltip))) {
          return element.getAttribute(''.concat(options.tooltip))
        } else if (options.tooltip == 'auto') {
          for (var _i = 0, _arr = ['data-verticator-tooltip', 'data-name', 'title']; _i < _arr.length; _i++) {
            var attr = _arr[_i]

            if (element.getAttribute(attr)) {
              return element.getAttribute(attr)
            }
          }

          for (var _i2 = 0, _arr2 = ['h1', 'h2', 'h3', 'h4']; _i2 < _arr2.length; _i2++) {
            var slctr = _arr2[_i2]

            if (element.querySelector(slctr)) {
              return element.querySelector(slctr).textContent
            }
          }
        } else return false
      }

      var createBullets = function createBullets(event, sections) {
        theVerticator.style.color = options.color
        theVerticator.classList.remove('visible')
        var listHtml = ''
        sections.forEach(function (section) {
          var i = section[0]
          var tooltipname = section[1]
          var link = 'href="#/'.concat(event.indexh + options.indexbase, '/').concat(i + options.indexbase, '"')
          var dataname = tooltipname ? 'data-name="'.concat(tooltipname, '"') : ''
          var tooltip = tooltipname ? '<div class="tooltip"><span>'.concat(tooltipname, '</span></div>') : ''
          listHtml += '<li data-index="'
            .concat(i + options.indexbase, '"><a ')
            .concat(options.clickable ? link : '')
            .concat(dataname, '></a>')
            .concat(tooltip, '</li>')
        })
        setTimeout(function () {
          theVerticator.innerHTML = listHtml
          activateBullet(event)
          theVerticator.classList.add('visible')
        }, 200)
      }

      var slideAppear = function slideAppear(event) {
        var slide = event.currentSlide
        var parent = slide.parentNode
        var sections = Array.from(parent.children)
          .map(function (elem, index) {
            return [index, elem]
          })
          .filter(function (indexedElem) {
            var issection = indexedElem[1].tagName == 'SECTION' && indexedElem[1].parentNode.tagName == 'SECTION'
            var isuncounted = options.skipuncounted && indexedElem[1].getAttribute('data-visibility') == 'uncounted'
            return issection && !isuncounted
          })
          .map(function (indexedElem) {
            var ttname = ''

            if (options.tooltip) {
              ttname = ttName(indexedElem[1])
            }

            return [indexedElem[0], ttname]
          })

        if (sections.length < 2) {
          theVerticator.classList.remove('visible')
          theVerticator.innerHTML = ''
        } else {
          if (event.previousSlide) {
            var lastParent = event.previousSlide.parentNode

            if (parent != lastParent) {
              createBullets(event, sections)
            }
          } else {
            createBullets(event, sections)
          }

          setTimeout(function () {
            activateBullet(event)
          }, 150)
        }
      }

      if (theVerticator) {
        deck.on('slidechanged', function (event) {
          slideAppear(event)
        })
        deck.on('ready', function (event) {
          slideAppear(event)
        })

        if (deck.getConfig().embedded) {
          deck.on('click', function (event) {
            clickBullet(event)
          })
        }
      }
    }

    var init = function init(deck) {
      var es5Filename = 'verticator.js'
      var defaultOptions = {
        darktheme: false,
        color: 'black',
        oppositecolor: 'white',
        skipuncounted: false,
        clickable: true,
        position: 'right',
        offset: '3vmin',
        autogenerate: true,
        tooltip: false,
        scale: 1,
        csspath: {
          verticator: '',
          tooltip: '',
        },
        debug: false,
      }

      var defaults = function defaults(options, defaultOptions) {
        for (var i in defaultOptions) {
          if (!options.hasOwnProperty(i)) {
            options[i] = defaultOptions[i]
          }
        }
      }

      var options = deck.getConfig().verticator || {}
      options.indexbase = deck.getConfig().hashOneBasedIndex ? 1 : 0

      if (options.darktheme) {
        if (!options.hasOwnProperty('color')) {
          defaultOptions.color = 'white'
        }

        if (!options.hasOwnProperty('oppositecolor')) {
          defaultOptions.oppositecolor = 'black'
        }
      }

      defaults(options, defaultOptions)

      function pluginPath() {
        var path
        var pluginScript = document.querySelector('script[src$="'.concat(es5Filename, '"]'))

        if (pluginScript) {
          path = pluginScript.getAttribute('src').slice(0, -1 * es5Filename.length)
        } else {
          path = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src) || new URL('verticator.js', document.baseURI).href).slice(
            0,
            (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src) || new URL('verticator.js', document.baseURI).href).lastIndexOf('/') + 1
          )
        }

        return path
      }

      var VerticatorStylePath = options.csspath.verticator ? options.csspath.verticator : ''.concat(pluginPath(), 'verticator.css') || 'plugin/verticator/verticator.css'
      var TooltipStylePath = options.csspath.tooltip ? options.csspath.tooltip : ''.concat(pluginPath(), 'tooltip.css') || 'plugin/verticator/tooltip.css'

      if (options.debug) {
        console.log('Plugin path = '.concat(pluginPath()))
        console.log('Verticator CSS path = '.concat(VerticatorStylePath))
        console.log('Tooltip CSS path = '.concat(TooltipStylePath))
      }

      loadStyle(VerticatorStylePath, 'stylesheet', function () {
        if (options.tooltip) {
          loadStyle(TooltipStylePath)
        }
      })
      verticate(deck, options)
    }

    return {
      id: 'verticator',
      init: init,
    }
  }

  return Plugin
})

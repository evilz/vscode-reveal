(function(){

  function fixUpSvgSize(divElem, svgElem) {
    var width = svgElem.getAttribute('width');
    var height = svgElem.getAttribute('height');
    var divWidth = divElem.offsetWidth;
    var divHeight = divElem.offsetHeight;

    if (width > divWidth || height > divHeight) {
      var viewBox = '0 0 ' + width + ' ' + height;
      svgElem.setAttribute('viewBox', viewBox);
      svgElem.setAttribute('width', divElem.offsetWidth);
      svgElem.setAttribute('height', divElem.offsetHeight);
    }
  }

  function getDataElem(slide) {
    var children = slide.getElementsByClassName('diagram-data');
    var spans = Array.prototype.filter.call(children, function(element) {
      return element.nodeName === 'SPAN';
    });

    var diagramSource = slide.getAttribute('data-diagram-source');
    if (diagramSource) {
      var diagramSlides = document.getElementsByClassName('diagram-slide');

      var sourceSlides = Array.prototype.filter.call(diagramSlides, function(slide) {
        return slide.getAttribute('data-state') === diagramSource;
      });

      return getDataElem(sourceSlides[0]);
    } else {
      return spans[0];
    }
  }

  function getDisplayDiv(slide) {
    var children = slide.getElementsByClassName('diagram-display');
    var divs = Array.prototype.filter.call(children, function(element) {
      return element.nodeName === 'DIV';
    });

    return divs[0];
  }

  function isDiagramSlide(slide) {
    return slide.classList.contains("diagram-slide");
  }

  function destroyDiagram(slide) {
    if (!isDiagramSlide(slide)) { return; }

    var svgDiv = getDisplayDiv(slide);
    while (svgDiv.firstChild) {
      svgDiv.removeChild(svgDiv.firstChild);
    }
    svgDiv.removeAttribute("data-processed");
  }

  function showDiagram(slide) {
    if (!isDiagramSlide(slide)) { return; }

    var dataElem = getDataElem(slide);
    var svgDiv = getDisplayDiv(slide);

    svgDiv.innerHTML = dataElem.innerHTML;

    mermaid.flowchartConfig
    var config = {};
    mermaid.init(config, svgDiv);

    // Fix up svg element size
    var svgElem = svgDiv.getElementsByTagName("svg")[0]; 
    if (svgElem) {
      fixUpSvgSize(svgDiv, svgElem);
    }
    
  }

  Reveal.addEventListener( 'slidechanged', function( event ) {
    if (event.previousSlide) {
      destroyDiagram(event.previousSlide);
    }

    if (event.currentSlide) {
      showDiagram(event.currentSlide);
    }
  });

}());

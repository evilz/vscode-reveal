(function(d3) {
 document.scaleX = 1; 
 document.scaleY = 1; 
 function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
 }

 d3.mouse = function(container) {
  return d3_mousePoint(container, d3_eventSource());
 };

 function d3_mousePoint(container, e) {
  var rect = container.getBoundingClientRect();
  return [ (e.clientX - rect.left - container.clientLeft)/document.scaleX, (e.clientY - rect.top - container.clientTop)/document.scaleY];
 };
})(d3);


import {Directive, Renderer, ElementRef} from '@angular/core';
declare var interact: any;
@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {

  constructor(el: ElementRef, renderer: Renderer) {
      renderer.setElementClass(el.nativeElement,"draggable",true);

      // from http://interactjs.io:
      new interact('.draggable')
          .draggable({
              inertia: true,
              restrict: {
                  restriction: "parent",
                  endOnly: true,
                  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
              },
              autoScroll: true,
              onmove: dragMoveListener,
              onend: function (event) {
              }
          });
      function dragMoveListener (event) {
          var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.webkitTransform =
              target.style.transform =
                  'translate(' + x + 'px, ' + y + 'px)';
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
      }
  }
}

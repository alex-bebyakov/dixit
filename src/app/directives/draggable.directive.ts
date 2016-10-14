import {Directive, Renderer, ElementRef} from '@angular/core';
import "interact.js/interact.js";
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
              // enable inertial throwing
              inertia: true,
              // keep the element within the area of it's parent
              restrict: {
                  restriction: "parent",
                  endOnly: true,
                  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
              },
              // enable autoScroll
              autoScroll: true,

              // call this function on every dragmove event
              onmove: dragMoveListener,
              // call this function on every dragend event
              onend: function (event) {

              }
          });
      function dragMoveListener (event) {
          var target = event.target,
              // keep the dragged position in the data-x/data-y attributes
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // translate the element
          target.style.webkitTransform =
              target.style.transform =
                  'translate(' + x + 'px, ' + y + 'px)';

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
      }


  }

}

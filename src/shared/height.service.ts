import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable()
export class HeightService {

  constructor(
    // private el: ElementRef,
    // private renderer: Renderer2
  ) {}

  setElementHeight(parentElementTag: string, childElementsIds: string[], offsetHeight: number, minHeight: number ): number {
    // Establecer el parent Height
    const parentElement = document.getElementsByTagName(parentElementTag);
    console.log('*** PARENT element:', parentElement);
    const parentHeight =  parentElement[0].parentElement['clientHeight'];

    // Calcular la suma de los child's height
    let childsHeight = 0;
    if (childElementsIds.length > 0) {
      for (let i = 0; i < childElementsIds.length; i++) {

        const childElement = document.getElementsByName(childElementsIds[i]);
        console.log('*** CHILD element:', childElementsIds[i], childElement);
        if (childElement) {
          childsHeight += childElement[0]['clientHeight'];
        }

      }
    }

    // Calcular la altura del componente y setearla en el DOM
    const componentHeight = parentHeight - childsHeight - offsetHeight;
    console.log(`*** HEIGHT-DIRECTIVE, Parent: ${parentHeight}, Childs: ${childsHeight}, Component: ${componentHeight}`);
    return (componentHeight < minHeight) ? minHeight : componentHeight;
  }

}

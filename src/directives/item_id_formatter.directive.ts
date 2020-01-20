import { Directive, HostListener } from '@angular/core';

/* *************************************************************************
 *  Directive:  Format the itemId field for items as:  YYYY-WW-NNNNNNNN
 *  where:
 *    YYYY: year the item enter into the system
 *    WW: warehouse ID where the item first enter
 *    NNNNNNNN: a sequential number
 *
 *  Usage inside form (HTML):
 *    <input appItemIdFormatter ... />
*/
@Directive({
  selector: '[appItemIdFormatter]',
})
export class ItemIdDirective {

  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    // Input must be of a valid alphanumeric format or a modifier key
    if (!(this.isAlphanumericInput(event) || this.isModifierKey(event))) {
      event.preventDefault();
    }
  }
  @HostListener('keyup', ['$event']) onKeyUp(event) {
    this.formatToItemId(event);
  }

  private isAlphanumericInput(event) {
    const key = event.keyCode;
    console.log('*** alpha:', key);
    return (
      (key >= 48 && key <= 57)  || // Allow number line
      (key >= 96 && key <= 105) || // Allow number pad
      (key >= 65 && key <= 90)     // Allow alphabetic characters (uppercase)
   );
  }

  private isModifierKey(event) {
    const key = event.keyCode;
    console.log('*** modifier:', key);
    return (event.shiftKey === true || key === 35 || key === 36)  // Allow Shift, Home, End
      || (key === 8 || key === 9 || key === 13 || key === 46)  // Allow Backspace, Tab, Enter, Delete
      || (key > 36 && key < 41)  // Allow left, up, right, down
      || ( // Allow Ctrl/Command + A,C,V,X,Z
          (event.ctrlKey === true || event.metaKey === true) &&
          (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
      );
  }

  // Format the itemId as YYYY-WW-NNNNNNNN
  private formatToItemId(event)  {
    if (this.isModifierKey(event)) {
      return;
    }

    // Format the number as wanted
    const target = event.target;
    const input = target.value; // .replace(/\s/g, '')
    const year = input.substring(0, 4);
    const warehouse = input.substring(4, 6);
    const itemNo = input.substring(6);

    if (input.length > 6) {
      target.value = `${year}-${warehouse}-${itemNo}`;
    } else if ( input.length > 4) {
      target.value = `${year}-${warehouse}`;
    } else if (input.length > 0) {
      target.value = `${year}`;
    }
    console.log('*** target.value:', target.value);
  }
}

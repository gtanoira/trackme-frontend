import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Pipe,
  PipeTransform
} from '@angular/core';

/*
  Directives exported:
  [onlyNumbers]: allow only numbers
  [toUppercase]: convert all string to uppercase
  [numberFormatter]: format a float number with decimal and thousand separators
*/

// Define variables
const DECIMAL_SEPARATOR  = '.';
const PADDING         = '000000000000';
const THOUSANDS_SEPARATOR = ',';

/* *************************************************************************************
 * Directive: Allow Only Numbers
 *
 * Usage inside form (HTML):
 *    <input type='text' numbers>
*/
@Directive({ selector: '[onlyNumbers]' })
export class OnlyNumbersDirective {
  constructor(public el: ElementRef) {
    this.el.nativeElement.onkeypress =
      evt => {
        if (evt.which < 48 || evt.which > 57) {
          evt.preventDefault();
        }
      };
  }
}

/* *********************************************************************
 *  Directive:  Force to Uppercase Letters
 *
 *  Usage inside form (HTML):
 *    <input appToUppercase ... />
*/
@Directive({
  selector: '[appToUppercase]',
  host: {
    '[value]': 'toUppercase',
    '(input)': 'format($event.target.value)'
  }
})
export class ToUppercaseDirective implements OnInit {
  @Input() toUppercase: string;
  @Output() toUppercaseChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    this.toUppercase = this.toUppercase || '';
    this.format(this.toUppercase);
  }

  format(value) {
    this.toUppercaseChange.next(value.toUpperCase());
  }
}

/* *************************************************************************
 *  Directive:  Format a float number with thousand and decimal separators
 *
 *  Usage inside form (HTML):
 *    <input [(numberFormatter)]='customerInfo.firstName' type='text'>
*/
@Directive({
  selector: '[numberFormatter]',
  host: {
    '[value]': 'numberFormatter',
    '(input)': 'format($event.target.value)'
  }
})
export class NumberFormatterDirective implements OnInit {
  @Input() numberFormatter: string;
  @Output() numberFormatterChange: EventEmitter<string> = new EventEmitter<string>();

  fractionSize: number = 2;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    // Only numbers
    this.el.nativeElement.onkeypress =
      evt => {
        if ((evt.which < 48 || evt.which > 57) && evt.which !== 46) {
          evt.preventDefault();
        }
      };
    this.numberFormatter = this.numberFormatter || '';
    this.format(this.numberFormatter);
  }

  format(value) {
    // Format the value
    let [integer, fraction = ''] = (value || '').toString().split(DECIMAL_SEPARATOR);
    fraction = (this.fractionSize > 0)
          ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, this.fractionSize)
          : '';

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
    this.numberFormatterChange.next(integer + fraction);
  }
}

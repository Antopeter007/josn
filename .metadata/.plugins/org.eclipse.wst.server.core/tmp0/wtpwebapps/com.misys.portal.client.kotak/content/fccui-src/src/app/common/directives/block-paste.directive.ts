import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockPaste]',
})
export class BlockPasteDirective {
  constructor() {
    //empty constructor
  }

  @HostListener('paste', ['$event'])
  blockPaste(e: Event) {
    e.preventDefault();
  }
}

import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[OnFocusInput]'
})
export class OnFocusInputDirective {
    private focus = true;

    constructor(protected el: ElementRef) {
    }

    ngOnInit() {
        if (this.focus) {
            // Otherwise Angular throws error: Expression has changed after it was checked.
            window.setTimeout(() => {
                this.el.nativeElement.focus();

            });
        }
    }

    @Input() set autofocus(condition: boolean) {
        this.focus = condition !== false;
    }
}

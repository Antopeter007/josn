import { DynamicContentComponent } from './../../../../base/components/dynamic-content.component';
import {
  Component, OnInit
} from '@angular/core';

@Component({
  selector: 'lc-dynamic-component',
  template: `<ng-container #container></ng-container>`
})

export class SIDynamicComponent extends DynamicContentComponent implements OnInit {

}

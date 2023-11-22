import {
  Component, OnInit
} from '@angular/core';
import { DynamicContentComponent } from './../../base/components/dynamic-content.component';

@Component({
  selector: 'dynamic-component-content',
  template: `<ng-container #container></ng-container>`
})
export class GlobalDynamicComponent  extends DynamicContentComponent implements OnInit {

}

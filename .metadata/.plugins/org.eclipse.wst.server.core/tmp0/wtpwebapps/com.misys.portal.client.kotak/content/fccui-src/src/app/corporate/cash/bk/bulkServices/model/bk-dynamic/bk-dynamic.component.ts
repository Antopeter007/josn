import {
  Component, OnInit
} from '@angular/core';
import { DynamicContentComponent } from '../../../../../../base/components/dynamic-content.component';

@Component({
  selector: 'bk-dynamic-component',
  template: `<ng-container #container></ng-container>`
})
export class BkDynamicComponent extends DynamicContentComponent implements OnInit {

}



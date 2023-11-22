import {
  Component, OnInit
} from '@angular/core';
import { DynamicContentComponent } from '../../../../../base/components/dynamic-content.component';

@Component({
  selector: 'lc-dynamic-component',
  template: `<ng-container #container></ng-container>`
})
export class FtTptDynamicComponent extends DynamicContentComponent implements OnInit {

}

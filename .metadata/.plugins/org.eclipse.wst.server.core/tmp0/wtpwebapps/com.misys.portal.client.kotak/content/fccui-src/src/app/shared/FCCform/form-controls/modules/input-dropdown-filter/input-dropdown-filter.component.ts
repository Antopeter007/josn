import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';

import { LcConstant } from './../../../../../corporate/trade/lc/common/model/constant';

import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { TranslateService } from '@ngx-translate/core';
import { Dropdown } from 'primeng';

@Component({
  selector: 'fcc-input-dropdown-filter',
  templateUrl: './input-dropdown-filter.component.html',
  styleUrls: ['./input-dropdown-filter.component.scss'],
})
export class InputDropdownFilterComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  @ViewChild('dropdown') dropdown: Dropdown;
  compData = new Map<string, any>();
  lcConstant = new LcConstant();

    constructor(protected translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
  }
  ngAfterViewInit(): void {
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
    this.addAccessibilityControl();
  }
  focus(event): void {
    const keycodeIs = event.which || event.keyCode;
    if (document.getElementsByClassName('focusClass') &&
      document.getElementsByClassName('focusClass').length > 0 &&
      document.getElementsByClassName('focusClass')[0].classList) {
      if (!document.getElementsByClassName('focusClass')[0].classList.contains('focusStyle')) {
        if (keycodeIs === this.lcConstant.nine) {
          document.getElementsByClassName('focusClass')[0].classList.add('focusStyle');
        }
        if (event.shiftKey || keycodeIs === this.lcConstant.nine) {
          document.getElementsByClassName('focusClass')[0].classList.add('focusStyle');
        }
        if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
          document.getElementsByClassName('focusClass')[0].classList.add('focusStyle');
        }
      }
      if (document.getElementsByClassName('focusClass')[0].classList.contains('focusStyle')) {
        if (keycodeIs !== this.lcConstant.nine && event.shiftKey) {
          document.getElementsByClassName('focusClass')[0].classList.remove('focusStyle');
        }
      }
    }
    if (this.dropdown && keycodeIs === this.lcConstant.thirteen) {
      this.dropdown.focus();
    }
  }
  focusOut(): void {
    if (document.getElementsByClassName('focusClass') &&
      document.getElementsByClassName('focusClass').length > 0 &&
      document.getElementsByClassName('focusClass')[0].classList &&
      document.getElementsByClassName('focusClass')[0].classList.contains('focusStyle')) {
      document.getElementsByClassName('focusClass')[0].classList.remove('focusStyle');
    }
  }

  addAccessibilityControl(): void {
    if(this.control?.params?.dropdownAriaLabel){
    document.getElementById(this.labelId).innerText = this.translateService.instant(this.control.params.dropdownAriaLabel) ?? '';
    }
  }

  getMarginBottom() {
    if (this.control.params.noMarginBottom ) {
      return '0px';
    } else {
      return '20px';
    }
  }

  get labelId(): string {
    return 'pDropdownLabel_' + this.control.params.label;
  }

  changeEvent(event, control) {
    if(control.params.changeEventFlag){
      this.onChangeCustomEventRaised(event, control.key);
    } else {
      this.onEventRaised(event, control.key);
    }
  }

  get getStyleClass(): string {
    let styles = '';
    if (typeof(this.control.params.styleClass) === 'object') {
      styles = this.control.params?.styleClass?.length > 1 ?
      this.control?.params?.styleClass?.join(' ') : this.control?.params?.styleClass[0];
    } else {
      styles = this.control.params.styleClass;
    }
    return (this.control.dirty || this.control.touched) && this.control.invalid ? 'ui-float-label focusClass not-valid ' +
    styles : 'ui-float-label focusClass  ' + styles;
  }
}

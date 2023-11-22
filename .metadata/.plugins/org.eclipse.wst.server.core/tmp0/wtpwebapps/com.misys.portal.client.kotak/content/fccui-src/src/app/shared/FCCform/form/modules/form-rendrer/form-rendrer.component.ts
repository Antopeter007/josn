import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import {
  IDataEmittterModel,
  IFCCRegistrationConfig,
} from '../../../form-controls/form-control-resolver/form-control-resolver.model';
import { FormControlResolverService } from '../../../form-controls/form-control-resolver/form-control-resolver.service';

@Component({
  selector: 'app-form-rendrer',
  templateUrl: './form-rendrer.component.html',
  styleUrls: ['./form-rendrer.component.scss'],
})
export class FormRendrerComponent extends FCCBase implements OnInit, OnDestroy {
  @Input() formGroup!: FCCFormGroup;
  @Input() module!: string;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlComponentListEmitter: EventEmitter<Map<string, any>> =
    new EventEmitter<Map<string, any>>();

  controlComponentMap = new Map<string, any>();
  subscriptions: Subscription[] = [];
  totalControls = 0;
  dir = localStorage.getItem('langDir');

  errorHeader = `${this.translate.instant('errorTitle')}`;
  registeredControls: Map<string, IFCCRegistrationConfig> | null = null;
  constructor(protected formControlResolver: FormControlResolverService, protected translate: TranslateService) {
    super();
  }

  ngOnInit(): void {
    if (!this.formControlResolver.isIntialised) {
      this.formControlResolver.initialize();
    }
    this.registeredControls = this.formControlResolver.getAllRegisteredForms();
    this.formGroup.productControls.forEach((control) => {
      const key = FormControlResolverService.getFormType(control?.type);
      if (
        this.registeredControls.has(key) &&
        control.params.rendered &&
        control.type !== FccGlobalConstant.SPACER
      ) {
        this.totalControls++;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  getControlForTextarea(control): boolean {
    return (control === 'narrative-textarea');
  } 

  getControlForHighLightTextEditor(control): boolean {
    if(control === 'highlight-texteditor'){
      return true;
    }
    return false;
  }
  
  getControlForTable(control): boolean {
    return (control === 'expansion-panel-table');
  }
  renderClass(control){
    if (this.getControlForTable(control)){
      return 'form-field-table-message';
    } else if (this.getControlForTextarea(control)){
      return 'form-field-text-area-message';
    } else {
      return 'form-field-error-message';
    }
  }

  handleControlComponentsData(event: IDataEmittterModel) {
    if (
      event.control &&
      event.control.type !== FccGlobalConstant.SPACER &&
      event.control.key
    ) {
      this.controlComponentMap.set(event.control.key, event.data);
    } else if (event.control.type === FccGlobalConstant.SPACER) {
      this.totalControls--;
    } else {
      this.controlComponentMap.set('controlKey', event.data);
    }
    if (this.totalControls === this.controlComponentMap.size) {
      this.controlComponentListEmitter.emit(this.controlComponentMap);
    }
  }
}

import { EventEmitter } from '@angular/core';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';

export interface IFormData {
  formGroup: FCCFormGroup;
  module: string;
  mode: string;
  hostComponentData: any;
}

export interface IFormWithEmitter extends IFormData {
  controlComponentListEmitter: EventEmitter<Map<string, any>>;
}

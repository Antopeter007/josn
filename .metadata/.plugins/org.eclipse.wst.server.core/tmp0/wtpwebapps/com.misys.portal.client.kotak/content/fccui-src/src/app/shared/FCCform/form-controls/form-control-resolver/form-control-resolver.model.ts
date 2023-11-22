import { EventEmitter, Type } from '@angular/core';
import { LoadChildrenCallback } from '@angular/router';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from '../../../../base/model/fcc-control.model';

export interface IFCCBaseConfig {
  type: string;
  load?: LoadChildrenCallback;
}

export interface IFCCRegistrationConfig extends IFCCBaseConfig {
  component: Type<IUpdateFccBase>;
}

export interface IDataEmittterModel {
  control: FCCMVFormControl;
  data: Map<string, any>;
}

export interface IFormControlData {
  control: FCCMVFormControl;
  form: FCCFormGroup;
  mode: string;
  hostComponentData: any;
}

export interface IUpdateFccBase extends IFormControlData {
  controlDataEmitter: EventEmitter<IDataEmittterModel>;
  updateFccBaseComponent: (
    hostComponentData: any,
    mode: string,
  ) => void;
}

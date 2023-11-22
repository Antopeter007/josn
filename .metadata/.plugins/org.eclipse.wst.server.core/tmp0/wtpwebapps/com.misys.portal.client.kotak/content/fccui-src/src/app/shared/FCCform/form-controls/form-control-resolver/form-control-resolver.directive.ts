import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FCCFormGroup,
  FCCMVFormControl,
} from '../../../../base/model/fcc-control.model';
import { IDataEmittterModel } from './form-control-resolver.model';
import { FormControlResolverService } from './form-control-resolver.service';

@Directive({
  selector: '[fccFormControlResolver]',
})
export class FormControlResolverDirective implements OnChanges {
  @Input() control: FCCMVFormControl | null = null;
  @Input() form: FCCFormGroup | null = null;
  @Input() mode: string | null;
  @Input() hostComponentData: any;
  @Output() controlComponentsData: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  controlEmitterSubscriptions: Subscription[] = [];
  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected formResolver: FormControlResolverService
  ) {}

  ngOnChanges() {
    if (!this.formResolver.isIntialised) {
      console.error('Form Registartion Not Done. Used Before Initialization');
      return;
    }
    if (this.control && this.form) {
      const compRef = this.formResolver.resolveForms(
        {
          control: this.control,
          form: this.form,
          mode: this.mode,
          hostComponentData: this.hostComponentData,
        },
        this.viewContainerRef
      );
      this.controlEmitterSubscriptions.push(
        compRef.instance.controlDataEmitter.subscribe(
          (data: IDataEmittterModel) => {
            this.controlComponentsData.emit(data);
          }
        )
      );
      if (compRef) {
        compRef.changeDetectorRef.detectChanges();
      }
    }
  }
}

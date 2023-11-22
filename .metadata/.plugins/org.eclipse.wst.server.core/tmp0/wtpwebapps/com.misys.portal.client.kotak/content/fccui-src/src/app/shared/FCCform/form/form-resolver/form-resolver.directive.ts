import {
  Directive,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Optional,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FormRendrerComponent } from '../modules/form-rendrer/form-rendrer.component';
import { FormResolverService } from './form-resolver.service';

export const HOST_COMPONENT = new InjectionToken<any>('HOST_COMPONENT');
@Directive({
  selector: '[fccFormResolver]',
})
export class FormResolverDirective implements OnChanges {
  @Input() formGroup!: FCCFormGroup;
  @Input() module!: string;
  @Input() mode!: string;
  @Output() controlComponentsData: EventEmitter<Map<string, Map<string, any>>> =
    new EventEmitter<Map<string, Map<string, any>>>();

  subscriptions: Subscription[] = [];
  hostComponentData: any;
  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected formResolver: FormResolverService,
    @Optional() @Inject(HOST_COMPONENT) hostComponentData: any | null
  ) {
    this.hostComponentData = hostComponentData;
  }
  ngOnChanges() {
    if (this.formGroup) {
      const compRef = this.formResolver.resolveForms(
        {
          module: this.module,
          formGroup: this.formGroup,
          mode: this.mode,
          hostComponentData: this.hostComponentData,
        },
        this.viewContainerRef,
        FormRendrerComponent
      );
      this.subscriptions.push(
        compRef.instance.controlComponentListEmitter.subscribe((data) => {
          this.controlComponentsData.emit(data);
        })
      );
      if (compRef) {
        compRef.changeDetectorRef.detectChanges();
      }
    }
  }
}

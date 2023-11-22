import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ValidationService } from '../../validators/validation.service';
import { ActivatedRoute } from '@angular/router';
import { CommonDataService } from '../../services/common-data.service';


@Component({
  selector: 'fcc-common-error-message',
  templateUrl: './app-error-message.component.html',
  styleUrls: ['./app-error-message.component.scss']
})
export class ErrorMessageComponent  {

   // errorMessage: string;
   @Input() control: UntypedFormControl;
   // Check if messages have to be displayed at the bottom, default: false
   @Input() messagePositionBelow = false;
   constructor(protected validationService: ValidationService, public activatedRoute: ActivatedRoute,
               public commonData: CommonDataService) { }

   @Input() public bgRecord;
   @Input() public controlMessagesForm: UntypedFormGroup;
   unsignedMode: string;

   get errorMessage() {
     if (this.control != null) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return this.validationService.validateField(this.control);
        }
      }
     }
     this.activatedRoute.params.subscribe(paramsId => {
          this.unsignedMode = paramsId.mode;
        });
     return null;
   }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder, FormControl } from '@angular/forms';
import { Constants } from './../../../../../common/constants';
import { validateSwiftCharSet } from './../../../../../common/validators/common-validator';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../../../common/services/common.service';
import { DialogService } from 'primeng';
import { EntityDialogComponent } from '../../../../../common/components/entity-dialog/entity-dialog.component';
import { Entity } from './../../../../../common/model/entity.model';
import { CommonDataService } from './../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-trade-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.scss']
})
export class ApplicantDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  applicantDetailsForm: UntypedFormGroup;
  option: string;

  constructor(protected fb: UntypedFormBuilder, protected activatedRoute: ActivatedRoute, public commonService: CommonService,
              public commonDataService: CommonDataService, public dialogService: DialogService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.option = paramsId.option;
    });
    const maxLen16 = 16;
    this.applicantDetailsForm = this.fb.group({
      entity: [''],
      applicantName: [''],
      applicantAddressLine1: [''],
      applicantAddressLine2: [''],
      applicantDom: [''],
      applicantReference: [''],
      applicantCountry: [''],
      applicantCustReference: ['', [Validators.required, Validators.maxLength(maxLen16),
        validateSwiftCharSet(Constants.X_CHAR)]]
    });

    this.getFieldValues();
    // Emit the form group to the parent
    this.formReady.emit(this.applicantDetailsForm);
  }

  getFieldValues() {
    this.applicantDetailsForm.patchValue({
       entity: this.bgRecord.entity,
       applicantName: this.bgRecord.applicant_name,
       applicantAddressLine1: this.bgRecord.applicant_address_line_1,
       applicantAddressLine2: this.bgRecord.applicant_address_line_2,
       applicantDom: this.bgRecord.applicant_dom,
       applicantReference: this.bgRecord.applicant_reference
      });
   }

   openEntityDialog(fieldId): void {
    const ref = this.dialogService.open(EntityDialogComponent, {
      header: this.commonService.getTranslation('TABLE_SUMMARY_ENTITIES_LIST'),
        width: '1000px',
        height: '400px',
        contentStyle: {overflow: 'auto'}
      });
    ref.onClose.subscribe((entity: Entity) => {
        if (entity) {
          this.applicantDetailsForm.get(fieldId).setValue(entity.ABBVNAME);
          this.applicantDetailsForm.get('applicantName').setValue(entity.NAME);
          this.applicantDetailsForm.get('applicantAddressLine1').setValue(entity.ADDRESSLINE1);
          this.applicantDetailsForm.get('applicantAddressLine2').setValue(entity.ADDRESSLINE2);
          this.applicantDetailsForm.get('applicantDom').setValue(entity.DOMICILE);
          this.applicantDetailsForm.get('applicantCountry').setValue(entity.COUNTRY);
          this.commonDataService.setEntity(entity.ABBVNAME);
        }
    });
  }
}

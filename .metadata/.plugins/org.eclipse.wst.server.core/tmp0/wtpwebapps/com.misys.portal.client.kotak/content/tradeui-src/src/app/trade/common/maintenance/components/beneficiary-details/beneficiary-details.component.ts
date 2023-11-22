import { EntityDialogComponent } from './../../../../../common/components/entity-dialog/entity-dialog.component';
import { Constants } from './../../../../../common/constants';
import { CommonDataService } from './../../../../../common/services/common-data.service';
import { CommonService } from './../../../../../common/services/common.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng';
import { validateSwiftCharSet } from './../../../../../common/validators/common-validator';
import { Entity } from './../../../../../common/model/entity.model';

@Component({
  selector: 'fcc-trade-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {

  beneficiaryDetailsForm: UntypedFormGroup;
  option: string;
  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(protected fb: UntypedFormBuilder, protected activatedRoute: ActivatedRoute, public commonService: CommonService,
              public commonDataService: CommonDataService, public dialogService: DialogService) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.option = paramsId.option;
    });

    this.beneficiaryDetailsForm = this.fb.group({
      entity: [''],
      beneficiaryName: [''],
      beneficiaryAddressLine1: [''],
      beneficiaryAddressLine2: [''],
      beneficiaryDom: [''],
      beneficiaryReference: [''],
      beneficiaryCountry: [''],
      cust_reference_id: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_16),
        validateSwiftCharSet(Constants.X_CHAR)]]
    });

    this.getFieldValues();
    // Emit the form group to the parent
    this.formReady.emit(this.beneficiaryDetailsForm);
  }

  getFieldValues() {
    this.beneficiaryDetailsForm.patchValue({
      entity: this.bgRecord.entity,
      beneficiaryName: this.bgRecord.beneficiaryName,
      beneficiaryAddressLine1: this.bgRecord.beneficiaryAddressLine1,
      beneficiaryAddressLine2: this.bgRecord.beneficiaryAddressLine1,
      beneficiaryDom: this.bgRecord.beneficiaryDom,
      beneficiaryReference: this.bgRecord.beneficiaryReference
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
        this.beneficiaryDetailsForm.get(fieldId).setValue(entity.ABBVNAME);
        this.beneficiaryDetailsForm.get('beneficiaryName').setValue(entity.NAME);
        this.beneficiaryDetailsForm.get('beneficiaryAddressLine1').setValue(entity.ADDRESSLINE1);
        this.beneficiaryDetailsForm.get('beneficiaryAddressLine2').setValue(entity.ADDRESSLINE2);
        this.beneficiaryDetailsForm.get('beneficiaryDom').setValue(entity.DOMICILE);
        this.beneficiaryDetailsForm.get('beneficiaryCountry').setValue(entity.COUNTRY);
        this.commonDataService.setEntity(entity.ABBVNAME);
      }
    });
  }

}

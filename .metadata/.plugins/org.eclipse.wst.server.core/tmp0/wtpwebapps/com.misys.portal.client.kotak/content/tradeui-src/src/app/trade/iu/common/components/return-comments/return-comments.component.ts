import { CommonService } from './../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';


@Component({
  selector: 'fcc-iu-common-return-comments',
  templateUrl: './return-comments.component.html',
  styleUrls: ['./return-comments.component.scss']
})
export class IUCommonReturnCommentsComponent implements OnInit {
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Input() public bgRecord;
  commentsForm: UntypedFormGroup;
  viewMode: boolean;
  constructor(protected fb: UntypedFormBuilder, public validationService: ValidationService, 
              protected commonDataService: IUCommonDataService,
              protected commonData: CommonDataService, public commonService: CommonService) { }

  ngOnInit() {
    this.commentsForm = this.fb.group({
      returnComments: ''
     });

     // Added as it is a core feature to get return comment on the UI
    this.commentsForm.patchValue({
      returnComments: this.bgRecord.returnComments
    });

    this.formReady.emit(this.commentsForm);
    if (this.bgRecord.tnxTypeCode === '03' && this.bgRecord.subTnxTypeCode === '05'
     && this.bgRecord.productCode === Constants.PRODUCT_CODE_IU) {
      if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW) {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }
    } else {
    this.viewMode = this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ?
                    this.commonData.getViewComments() : this.commonDataService.getViewComments();
    }
  }

  generatePdf(generatePdfService) {
    if (this.bgRecord.returnComments) {
      generatePdfService.setNarrativeSectionDetails('HEADER_MC_COMMENTS_FOR_RETURN', true, false, false, this.bgRecord.returnComments);
    }
  }
}

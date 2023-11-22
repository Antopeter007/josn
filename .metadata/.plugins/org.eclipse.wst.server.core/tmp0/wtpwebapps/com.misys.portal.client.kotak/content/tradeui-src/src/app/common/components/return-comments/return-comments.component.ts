import { CommonService } from './../../services/common.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CommonDataService } from '../../services/common-data.service';
import { ValidationService } from '../../validators/validation.service';

@Component({
  selector: 'fcc-common-return-comments',
  templateUrl: './return-comments.component.html',
  styleUrls: ['./return-comments.component.scss']
})
export class ReturnCommentsComponent implements OnInit {

  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Input() public fileContent;
  commentsForm: UntypedFormGroup;
  viewMode: boolean;
  constructor(protected readonly fb: UntypedFormBuilder, public validationService: ValidationService,
              protected readonly commonData: CommonDataService, public commonService: CommonService) { }

  ngOnInit() {
    this.commentsForm = this.fb.group({
      returnComments: ''
     });

     // Added as it is a core feature to get return comment on the UI
    this.commentsForm.patchValue({
      returnComments: this.fileContent.returnComments
    });
    this.viewMode =  this.commonData.getViewComments();
    this.formReady.emit(this.commentsForm);
  }

  generatePdf(generatePdfService) {
    if (this.fileContent.returnComments) {
      generatePdfService.setNarrativeSectionDetails('HEADER_MC_COMMENTS_FOR_RETURN', true, false, false, this.fileContent.returnComments);
    }
  }
}

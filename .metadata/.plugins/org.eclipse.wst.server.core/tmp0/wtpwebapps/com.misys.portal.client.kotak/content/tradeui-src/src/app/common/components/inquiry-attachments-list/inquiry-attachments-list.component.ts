import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../common/services/common.service';
import { DownloadAttachmentService } from '../../services/downloadAttachment.service';

interface FileAttachmentsList {
  attId: string;
  fileName: string;
  type: string;
  status: string;
  title: string;
  objectData?: object;
}

@Component({
  selector: 'fcc-common-inquiry-attachments-list',
  templateUrl: './inquiry-attachments-list.component.html',
  styleUrls: ['./inquiry-attachments-list.component.scss']
})
export class InquiryAttachmentsListComponent implements OnInit {
  refId: string;
  imagePath: string;
  productCode: string;
  attachmentsList: FileAttachmentsList[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected commonService: CommonService,
              public translate: TranslateService, public downloadAttachmentService: DownloadAttachmentService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.productCode = paramsId.productcode;
      });
    this.imagePath = this.commonService.getImagePath();
    this.commonService.getFileAttachments(this.refId, this.productCode).subscribe(data => {
      this.attachmentsList = data.fileAttachments;
    });
  }

  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }
}

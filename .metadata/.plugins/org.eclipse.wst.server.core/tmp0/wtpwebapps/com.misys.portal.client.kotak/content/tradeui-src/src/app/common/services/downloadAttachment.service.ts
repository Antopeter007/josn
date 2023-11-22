import { Constants } from '../../common/constants';
import { Injectable } from '@angular/core';
import { IUService } from '../../trade/iu/common/service/iu.service';


@Injectable({ providedIn: 'root' })
export class DownloadAttachmentService {

  constructor(public iuService: IUService) { }

  download(attId: string, fileName: string): void {
    if (attId && fileName) {
      this.iuService.downloadAttachment(attId).subscribe(response => {
      const authError = response.headers.get('authError');
      if (!authError) {
        let fileType;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
        }, Constants.LENGTH_100);
      }
      });
    }
  }

}

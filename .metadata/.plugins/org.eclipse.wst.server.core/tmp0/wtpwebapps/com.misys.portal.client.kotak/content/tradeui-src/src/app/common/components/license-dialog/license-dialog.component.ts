import { LicenseData } from '../../model/licenseData';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import { Component, OnInit } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { IUService } from '../../../trade/iu/common/service/iu.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fcc-common-license-dialog',
  templateUrl: './license-dialog.component.html',
  styleUrls: ['./license-dialog.component.scss']
})

 export class LicenseDialogComponent implements OnInit {
  cols: any[];
  lsRefId: string;
  lsNumber: string;
  listOfLicenses: LicenseData[] = [];
  selectedLicenses: LicenseData[] = [];

  constructor(public uploadFile: LicenseService, protected iuService: IUService,
              protected commonDataService: IUCommonDataService,
              public ref: DynamicDialogRef, public config: DynamicDialogConfig,
              public commonService: CommonService) {}

    ngOnInit() {
     this.getListOfLicenses();
   }

   public getListOfLicenses(): void {
    this.iuService.getLicenses(this.lsRefId, this.lsNumber).subscribe(data => {
      this.listOfLicenses = data.licenseList;
     });
   }
}

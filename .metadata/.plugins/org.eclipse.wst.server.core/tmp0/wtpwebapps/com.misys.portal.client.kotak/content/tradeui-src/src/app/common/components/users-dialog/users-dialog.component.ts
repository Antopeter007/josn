import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { IUService } from './../../../trade/iu/common/service/iu.service';
import { IUCommonDataService } from './../../../trade/iu/common/service/iuCommonData.service';


interface Users {
  fullName: string;
  date: string;
  description: string;
}

@Component({
  selector: 'fcc-common-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})
export class UsersDialogComponent implements OnInit {
  constructor( public readonly iuService: IUService, public readonly commonDataService: IUCommonDataService,
               public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  listOfUsers: Users[] = [];
  refId: string;
  tnxType: string;

  ngOnInit() {
   this.refId = this.commonDataService.getRefId();
   this.tnxType = this.commonDataService.getTnxType();
   this.iuService.getListOfUsers(this.refId, this.commonDataService.getTnxId()).subscribe(data => {
      this.listOfUsers = data.usersList;
     });
}

}

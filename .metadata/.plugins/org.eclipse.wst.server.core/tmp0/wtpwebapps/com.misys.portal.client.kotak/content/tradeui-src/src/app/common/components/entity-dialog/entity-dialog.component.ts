import { Customer } from './../../model/customer.model';
import { UntypedFormGroup } from '@angular/forms';
import { Entity } from '../../model/entity.model';
import { Component, OnInit} from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { CommonDataService } from '../../services/common-data.service';
import { CustomerEntityListDialogComponent
 } from '../../../common/components/customer-entity-list-dialog/customer-entity-list-dialog.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fcc-common-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.scss'],
  providers: [DialogService]
})
export class EntityDialogComponent implements OnInit {

  cols: any[];
  listOfEntities: Entity[] = [];
  abbvName: string;
  name: string;
  filteredListOfEntities: Entity[] = [];
  ruApplicantBeneForm: UntypedFormGroup;
  applicantType: string;
  parentDialogRef: DynamicDialogRef;

  constructor(protected entityService: EntityService, public ref: DynamicDialogRef,
              public commonData: CommonDataService, protected dialogService: DialogService,
              public config: DynamicDialogConfig, public commonService: CommonService) {
    this.parentDialogRef = ref;
  }

  ngOnInit() {
    if (this.commonData.getIsBankUser()) {
      this.ruApplicantBeneForm = this.config.data.form;
    }
    if (this.commonData.getProductCode() === 'BG') {
      this.applicantType = 'applicant';
    } else {
      this.applicantType = 'beneficiary';
    }
    this.getEntities();
  }

  public getFilteredListOfEntities(): void {
    this.filteredListOfEntities = this.listOfEntities.filter(d => (!this.abbvName && !this.name) ||
                                        (this.abbvName === d.ABBVNAME && !this.name) ||
                                        (!this.abbvName && this.name === d.NAME) ||
                                        (this.abbvName === d.ABBVNAME && this.name === d.NAME));
  }

  public getEntities(): void {
    this.entityService.getUserEntities('',  this.abbvName, this.name).subscribe(data => {
      this.listOfEntities = data.items;
      this.filteredListOfEntities = this.listOfEntities;
    });
   }

   public getCustomerEntityList(entityAbbvName: string, entityName: string): void {
     const customerEntityRef = this.dialogService.open(CustomerEntityListDialogComponent, {
          data: {abbvName: entityAbbvName, name: entityName},
          header: entityAbbvName,
          width: '60vw',
          height: '60vh',
          contentStyle: {overflow: 'auto', height: '60vh'},
        });
     customerEntityRef.onClose.subscribe((customerEntity: Customer) => {
          if (customerEntity) {
            this.parentDialogRef.close(customerEntity);
          }
      });
    }

}

import { Customer } from './../../model/customer.model';
import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
@Component({
  selector: 'fcc-common-customer-entity-list-dialog',
  templateUrl: './customer-entity-list-dialog.component.html',
  styleUrls: ['./customer-entity-list-dialog.component.scss']
})
export class CustomerEntityListDialogComponent implements OnInit {

  constructor(protected entityService: EntityService, public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { }

  cols: any[];
  listOfCustomerEntities: Customer[] = [];
  entity: string;
  name: string;
  filteredListOfCustomerEntities: Customer[] = [];
  entityAbbvName: string;
  entityName: string;

  ngOnInit() {
    this.entityAbbvName = this.config.data.abbvName;
    this.entityName = this.config.data.name;
    this.getCustomerEntitiesList();
  }

  public getFilteredListOfCustomerEntities(): void {
    this.filteredListOfCustomerEntities = this.listOfCustomerEntities.filter(d => (!this.entity && !this.name) ||
                                        (this.entity === d.ENTITY && !this.name) ||
                                        (!this.entity && this.name === d.NAME) ||
                                        (this.entity === d.ENTITY && this.name === d.NAME));
  }

  public getCustomerEntitiesList(): void {
    this.entityService.getUserEntities('customerentities',  this.entityAbbvName, this.entityName).subscribe(data => {
      this.listOfCustomerEntities = data.items;
      this.filteredListOfCustomerEntities = this.listOfCustomerEntities;
    });
   }
}

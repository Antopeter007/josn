import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../base/services/product.service';
import { ListDefService } from '../../services/listdef.service';

@Component({
  selector: 'app-tabs-component',
  templateUrl: './tabs-component.component.html',
  styleUrls: ['./tabs-component.component.scss']
})
export class TabsComponentComponent implements OnInit {

  @Input() data: any;
  @Output() showViewAllListingPage: EventEmitter<any> = new EventEmitter<any>();
  tabValues: any;
  showTable: boolean;
  count: any;
  selectedTab = 0;

  constructor(protected productService: ProductService,
    protected translateService: TranslateService,
    protected changedetector: ChangeDetectorRef,
    protected listService: ListDefService) { }
  ngOnInit(): void {
    this.data.tableConfig.listdefName = this.data.tabs[0].listdefName;
    for(let i =0; i<this.data.tabs.length; i++){
      if( this.data.tabs[i].selected === "false"){
        this.listService.getCount(this.data.tabs[i].listdefName).subscribe((resp) => {
          this.data.tabs[i].count = resp.count;
        });
      }
    }
  }


  onTabChange(event) {
    this.selectedTab = event.index;
    this.data.tabs.forEach((val) => {
      if (val.index === event.index) {
        this.tabValues = val;
      }else {
        this.showTable = false;
      }
    });
    this.setTableConfig(this.tabValues);
    }

    setTableConfig(val) {
      this.showTable = true;
      this.data.tableConfig.listdefName = val.listdefName;
    }

    setCount(result){
      this.data.tabs[this.selectedTab].count = result.count;
    }
    onClickViewAll(event) {
      this.showViewAllListingPage.emit(event);
    }
}


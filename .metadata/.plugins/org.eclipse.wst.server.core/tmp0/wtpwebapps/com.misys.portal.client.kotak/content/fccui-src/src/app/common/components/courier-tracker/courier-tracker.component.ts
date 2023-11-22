import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import * as jsonpath from 'jsonpath';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { TableService } from '../../../base/services/table.service';
import { ListDefService } from '../../services/listdef.service';
import { Subscription } from 'rxjs';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';


 
@Component({
  selector: 'app-courier-tracker',
  templateUrl: './courier-tracker.component.html',
  styleUrls: ['./courier-tracker.component.scss']
  ,
  providers:[]
})
export class CourierTrackerComponent implements OnInit, OnChanges {

  url: string;
  apiData : any;
  paramData : any;
  paramDataList: any[] = [];
  staticField : any[] = [];
  panelOpenState : boolean;
  mapStaticFieldToExtJsonpath: any; 
  courierReferenceList: any[] = [];
  rowData : any;
  wayBillNo : any = "";
  courierPartnerAbbvName : any = "";
  courierListSubscription:Subscription;
  contextPath: string;
  response: any = false;
  WaybillApiLoaded: Promise<boolean>;
  trackingParam: any;
  trackingHeader: any;
  trackingParamName: any;
  errorDetail: any;
  originAddress: any;
  destinationAddress: any;
  latestCourierReferenceList: any[] = [];
  copyOflatestCourierReferenceList: any[] = [];
  searchForCourierData: string;
  dir: string = localStorage.getItem('langDir');
  sortField: string;
  sortLabelOptions: string[] = ['courier_partner', 'EVENT_REF', 'courier_partner_waybill_no', 'status'];
  sortingOrderTypes: string[] = [FccGlobalConstant.ASC, FccGlobalConstant.DESC];


  constructor(protected http: HttpClient, 
              protected router: Router, 
              protected translateService: TranslateService,
              public tableService: TableService, 
              protected listdefService: ListDefService, 
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService,
              public dialogConfig: DynamicDialogConfig) {
               }

  ngOnInit(): void {
    //eslint-disable-next-line no-console
    console.trace('Entering init() - courier-component');
    
    this.contextPath = this.commonService.getContextPath();
    this.courierReferenceList = [];
    this.courierReferenceList = this.dialogConfig.data.courierList;
    this.rowData = this.dialogConfig.data.rowData;
    // Display only latest courier Reference 
    // this.latestCourierReferenceList.push(this.courierReferenceList.at(-1));
    this.latestCourierReferenceList = this.courierReferenceList;

    this.panelOpenState = true;
    
    this.commonService.getParameterConfiguredValues(null, 'P99A').subscribe((P99Aresponse) => {
      if (P99Aresponse && P99Aresponse.paramDataList) {
        this.paramDataList = P99Aresponse.paramDataList;
        for(let i = 0; i < this.latestCourierReferenceList.length; i++) {
          this.paramDataList.filter(param => param.key_5 === this.latestCourierReferenceList[i]['courier_partner'])
          .forEach(element => {
            if(element && element.data_9 && element.data_2 && element.data_3)
            {
              this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath'] = JSON.parse(element.data_9);
            }
          });
        }
        for(let i = 0; i < this.latestCourierReferenceList.length; i++)
        {

      this.tableService.getCourierTrackerDetails(
        this.latestCourierReferenceList[i]['courier_partner_waybill_no'],
        this.latestCourierReferenceList[i]['courier_partner']).subscribe(
        (data) => {
          // this.response = true;
          this.latestCourierReferenceList[i]['response'] = true;

          data = data?.apiData ? JSON.parse(data.apiData) : "";
          if(data)
          {
            
          this.latestCourierReferenceList[i]['staticField'] = {};
          this.latestCourierReferenceList[i]['staticField']['awb_no'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['awb_no'])?.toString();

          this.latestCourierReferenceList[i]['staticField']['courier_type'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['courier_type'])?.toString();
          this.latestCourierReferenceList[i]['staticField']['origin_address'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['origin_address']);
          this.latestCourierReferenceList[i]['originAddress'] = (this.latestCourierReferenceList[i]['staticField']['origin_address'][0]) 
          ? Object.values(this.latestCourierReferenceList[i]['staticField']['origin_address'][0])
          ?.join().replace(/(false,|true,|,false|,true)/g,'') : "";
          this.latestCourierReferenceList[i]['staticField']['destination_address'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['destination_address']);
          this.latestCourierReferenceList[i]['destinationAddress'] 
          = (this.latestCourierReferenceList[i]['staticField']['destination_address'][0])
          ? Object.values(this.latestCourierReferenceList[i]['staticField']['destination_address'][0])
          ?.join().replace(/(false,|true,|,false|,true)/g,'') : "";
          this.latestCourierReferenceList[i]['staticField']['status'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['status'])?.toString();
          this.latestCourierReferenceList[i]['staticField']['tracking_details'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['tracking_details']);
          this.latestCourierReferenceList[i]['staticField']['status'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['status'])?.toString();
          this.latestCourierReferenceList[i]['staticField']['expected_delivery'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['expected_delivery'])?.toString();
          this.latestCourierReferenceList[i]['staticField']['timestamp'] 
          = jsonpath.query(data, this.latestCourierReferenceList[i]['mapStaticFieldToExtJsonpath']['timestamp'])?.toString();
          }
          else
          {
            //eslint-disable-next-line no-console
            console.log('Some relevant third-party p-config might be missing.');
            this.latestCourierReferenceList[i]['response'] = false;
            this.latestCourierReferenceList[i]['errorDetail'] = `${this.translateService.instant('APIResponseError')}`;
          }
          this.WaybillApiLoaded = Promise.resolve(true);
          this.latestCourierReferenceList[i]['WaybillApiLoaded'] = Promise.resolve(true);

          },
          (errorResponse) => {
            if (errorResponse?.status === 401) {
              this.errorDetail = `${this.translateService.instant('APIResponseError')}`;
              this.latestCourierReferenceList[i]['errorDetail'] = `${this.translateService.instant('APIResponseError')}`;
            }
            else if (errorResponse?.statusText) {
              this.errorDetail = errorResponse.statusText;
              this.latestCourierReferenceList[i]['errorDetail'] = errorResponse.statusText;
            }
  
            this.response = false;
            this.latestCourierReferenceList[i]['response'] = false;
            this.router.navigate(['productListing'], {
              queryParams: {
                productCode: this.rowData.product_code,
                subProductCode: this.rowData.sub_product_code, option: FccGlobalConstant.GENERAL
              }
            });
            this.WaybillApiLoaded = Promise.resolve(true);
            this.latestCourierReferenceList[i]['WaybillApiLoaded'] = Promise.resolve(true);
          },
          );


        }

        for(let i = 0; i < this.latestCourierReferenceList.length; i++)
        {
          this.latestCourierReferenceList[i]['EVENT_REF'] 
          = this.latestCourierReferenceList[i]['imp_bill_ref_id'] || this.latestCourierReferenceList[i]['bo_tnx_id'];

        }
      }
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.log('Error: Check the P99A configuration', err);
    });
    
    //eslint-disable-next-line no-console
    console.trace('Exiting init() - courier-component');
    
  }
  
  ngOnChanges() : void{
    //eslint-disable-next-line no-console
    console.log('ngOnChanges');

  }

  searchInExpansionHeader() {
    if (this.copyOflatestCourierReferenceList.length > 0) {
      this.latestCourierReferenceList = this.copyOflatestCourierReferenceList;
    }
    if (this.searchForCourierData) {
      this.copyOflatestCourierReferenceList = this.latestCourierReferenceList;
      this.latestCourierReferenceList = this.latestCourierReferenceList.filter(res => {
        if (res) {
          const returnValue = (res.courier_partner?.trim()?.toLocaleLowerCase().match(this.searchForCourierData?.toLocaleLowerCase())
            || res.EVENT_REF?.trim()?.toLocaleLowerCase().match(this.searchForCourierData?.toLocaleLowerCase())
            || res.courier_partner_waybill_no?.trim()?.toLocaleLowerCase().match(this.searchForCourierData?.toLocaleLowerCase())
            || res?.staticField?.status?.trim()?.toLocaleLowerCase().match(this.searchForCourierData?.toLocaleLowerCase())
          );
          return returnValue;
        }
      }
      );
    }
  }

  setSortField(selectedSortField: any) {
    this.sortField = selectedSortField;
  }

  sortBasedOn(sortOrder?: string) {
    const aField = this.sortField;

    const ascSortFunc = (a, b): any => a[aField].localeCompare(b[aField]);
    const descSortFunc = (a, b): any => b[aField].localeCompare(a[aField]);
    const staticFieldString = 'staticField';
    const ascSortStaticFieldFunc = (a, b): any => a[staticFieldString][aField].localeCompare(b[staticFieldString][aField]);
    const descSortStaticFieldFunc = (a, b): any => b[staticFieldString][aField].localeCompare(a[staticFieldString][aField]);
    if (aField && sortOrder) {
      if (this.latestCourierReferenceList
        && this.latestCourierReferenceList.filter(obj => obj[aField]).length) {
        if (sortOrder === FccGlobalConstant.ASC) {
          this.latestCourierReferenceList = this.latestCourierReferenceList.sort(ascSortFunc);
        } else if (sortOrder === FccGlobalConstant.DESC) {
          this.latestCourierReferenceList = this.latestCourierReferenceList.sort(descSortFunc);
        }
      }
      else if (this.latestCourierReferenceList.filter(obj => obj['staticField'] && obj['staticField'][aField]).length) {
        if (sortOrder === FccGlobalConstant.ASC) {
          this.latestCourierReferenceList = this.latestCourierReferenceList.sort(ascSortStaticFieldFunc);
        } else if (sortOrder === FccGlobalConstant.DESC) {
          this.latestCourierReferenceList = this.latestCourierReferenceList.sort(descSortStaticFieldFunc);
        }
      }
    }
  }  



} 


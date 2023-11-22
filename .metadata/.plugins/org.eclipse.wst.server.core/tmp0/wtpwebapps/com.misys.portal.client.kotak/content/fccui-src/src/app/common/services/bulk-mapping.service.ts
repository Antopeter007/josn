import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class BulkMappingService {

  bulkDropdownMap = [];
  constructor(protected commonService: CommonService,
    protected translateService: TranslateService) { }

  getDropdownValues(form, entityVal){
    if(this.bulkDropdownMap.length === 0){
      this.commonService.getBulkMappingDetails().subscribe(response => {
        if(response){
          this.bulkDropdownMap = response.body.bktype;
          this.getProductGroupValues(this.bulkDropdownMap, form, entityVal);
        }
      });
    } else {
      this.getProductGroupValues(this.bulkDropdownMap, form, entityVal);
    }
  }

  getProductGroupValues(response, form, entityVal){
    const productGroupList = [];
    if((form.get(FccGlobalConstant.BK_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] && entityVal !== '*') ||
        !(form.get(FccGlobalConstant.BK_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] && entityVal === '*')){
      response.forEach(element => {
        if(element.entity === entityVal || element.entity === undefined){
          let productGroup: { label: string, value: any } = {
            label: element.description,
              value : {
                label: element.description,
                code: element.code
              }
          };
          if(element.code === FccGlobalConstant.PAYMENT_PRODUCT_GROUP){
            productGroup = {
              label: `${this.translateService.instant(element.code)}`,
                value : {
                  label: `${this.translateService.instant(element.code)}`,
                  code: element.code
                }
            };
          }
          productGroupList.push(productGroup);
        }
      });
      form.get('bkProductGroup')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = productGroupList;
      form.updateValueAndValidity();
    }
  }

  getDropdownValuesOnBankSelect(form, entityVal, bankVal){
    this.commonService.getBulkMappingDetails(bankVal).subscribe(response => {
      if(response.body.bktype){
        this.bulkDropdownMap = response.body.bktype;
        this.getProductGroupValues(this.bulkDropdownMap, form, entityVal);
      } else {
        this.commonService.bulkBankError.next(true);
      }
    });
  }


  getSubProductCode(form, entityVal, productGroupVal){
    form.get('bkProductType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    form.get('bkProductType').setValue(null);
    const subProductCodeList = [];
    this.bulkDropdownMap.forEach(element => {
      if(element.entity === entityVal && element.code === productGroupVal.code){
        if(typeof element.ft_sub_product_code === 'object' && this.commonService.isEmptyValue(element.ft_sub_product_code.length)){
          const productType: { label: string, value: any } = {
            label: element.ft_sub_product_code.description,
              value : {
                label: element.ft_sub_product_code.description,
                code: element.ft_sub_product_code.code,
                subProductCode: element.ft_sub_product_code.sub_product_code,
                description: element.ft_sub_product_code.sub_product_code_description
              }
          };
          subProductCodeList.push(productType);
        } else if (element.ft_sub_product_code.length > 1){
          element.ft_sub_product_code.forEach(element => {
            const productType: { label: string, value: any } = {
              label: element.description,
                value : {
                  label: element.description,
                  code: element.code,
                  subProductCode: element.sub_product_code,
                  description: element.sub_product_code_description
                }
            };
            subProductCodeList.push(productType);
          });
        }
      }
    });
    form.get('bkProductType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = subProductCodeList;
    form.updateValueAndValidity();
  }

  getPayrollType(form, entityVal, productGroup){
    const payrollTypeList = [];
    this.bulkDropdownMap.forEach(element => {
      if(element.code === productGroup.code){
        element.payroll_type.forEach(id => {
          if(id.entity === entityVal){
            const productGroup: { label: string, value: any } = {
              label: id.description,
                value : {
                  label: id.description,
                  code: id.code
                }
            };
            payrollTypeList.push(productGroup);
          }
        });
      }
    });
    form.get('bkPayrollType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = payrollTypeList;
    form.updateValueAndValidity();
  }

  getPayrollSubProductCode(form, entityVal, productGroup, payrollType){
    form.get('bkProductType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    form.get('bkProductType').setValue(null);
    const subProductCodeList = [];
    this.bulkDropdownMap.forEach(id => {
      if(id.code === productGroup.code){
        id.payroll_type.forEach(element => {
          if(element.entity === entityVal && element.code === payrollType.code){
            if(typeof element.ft_sub_product_code === 'object' && this.commonService.isEmptyValue(element.ft_sub_product_code.length)){
              const productType: { label: string, value: any } = {
                label: element.ft_sub_product_code.description,
                  value : {
                    label: element.ft_sub_product_code.description,
                    code: element.ft_sub_product_code.code,
                    subProductCode: element.ft_sub_product_code.sub_product_code,
                    description: element.ft_sub_product_code.sub_product_code_description
                  }
              };
              subProductCodeList.push(productType);
            } else if (element.ft_sub_product_code.length > 1){
              element.ft_sub_product_code.forEach(element => {
                const productType: { label: string, value: any } = {
                  label: element.description,
                    value : {
                      label: element.description,
                      code: element.code,
                      subProductCode: element.sub_product_code,
                      description: element.sub_product_code_description
                    }
                };
                subProductCodeList.push(productType);
              });
            }
          }
        });
      }
    });
    form.get('bkProductType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = subProductCodeList;
    form.updateValueAndValidity();
  }
}

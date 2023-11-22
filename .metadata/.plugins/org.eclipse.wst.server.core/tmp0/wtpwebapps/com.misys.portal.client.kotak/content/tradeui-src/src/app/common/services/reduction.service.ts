import { Constants } from './../constants';
import { Injectable } from '@angular/core';
import { IrregularDetails } from '../model/IrregularDetails.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReductionService {public arr: File[] = [];
  public bgIrregularReductionMap: IrregularDetails[] = [];
  public cuIrregularReductionMap: IrregularDetails[] = [];
  public undertakingType: string;
  public sequenceId = '00';
  public cuSequenceId = '00';
  constructor(protected commonService: CommonService) { }

  pushIrregularDetails(event: string, type: string, operationType: string, date: string, percentage: string, amt: string,
                       curCode: string, reductionType: string, adviseEventFlag: string, adviseDaysperNb: string,
                       sequence: string) {
    this.undertakingType = type;

    if (type === Constants.UNDERTAKING_TYPE_IU || type === Constants.UNDERTAKING_TYPE_BR ) {
      return this.createOrUpdateMap(event, type, operationType, date, percentage, amt,
        curCode, reductionType, adviseEventFlag, adviseDaysperNb,
        sequence, '01', this.sequenceId, this.bgIrregularReductionMap);
    } else if (type === Constants.UNDERTAKING_TYPE_CU) {
      return this.createOrUpdateMap(event, type, operationType, date, percentage, amt,
        curCode, reductionType, adviseEventFlag, adviseDaysperNb,
        sequence, '02', this.cuSequenceId, this.cuIrregularReductionMap);
    }

  }

  createOrUpdateMap(event: string, type: string, operationType: string, date: string, percentage: string, amt: string,
                    curCode: string, reductionType: string, adviseEventFlag: string, adviseDaysperNb: string,
                    sequence: string, sectionType: string, sequenceId: string, irregularReductionMap: IrregularDetails[]) {
    if (event === 'edit') {
      let deleteIndex: number;
      for (let i = 0; i <  irregularReductionMap.length; i++) {
        if (irregularReductionMap[i].variationSequence === sequence) {
            sequenceId = irregularReductionMap[i].variationSequence;
            deleteIndex = i;
          }
        }
      irregularReductionMap.splice(deleteIndex, 1);
      irregularReductionMap.push(new IrregularDetails(operationType, date, percentage, amt, curCode,
      sequenceId, reductionType, adviseEventFlag, adviseDaysperNb, sectionType));
      irregularReductionMap = this.commonService.sortIrregularList(irregularReductionMap);
      this.updateMapSequence(irregularReductionMap);
      } else {
      sequenceId = (irregularReductionMap.length + parseInt('01', 10)).toString();
      if (operationType && operationType !== null && operationType !== '') {
        irregularReductionMap.push(new IrregularDetails(operationType, date, percentage, amt, curCode,
                                          sequenceId, reductionType, adviseEventFlag, adviseDaysperNb, sectionType));
        irregularReductionMap = this.commonService.sortIrregularList(irregularReductionMap);
        this.updateMapSequence(irregularReductionMap);
      }
    }
    return irregularReductionMap;
  }

  getBgIrregularlist() {
      return this.bgIrregularReductionMap;
    }

   getCuIrregularlist() {
    return this.cuIrregularReductionMap;
   }

  updateMapSequence(map: IrregularDetails[]) {
    if (map.length > 0) {
      for (let i = 0; i < map.length; i++) {
        map[i].variationSequence = (i + 1).toString();
      }
    }
  }

  validateIrregularItems(irregularReductionMap: IrregularDetails[], undertakingType: string) {
    const irregularErrorList: IrregularDetails[] = [];
    const IrregularItemsList: IrregularDetails[] = [];
    let sortedList: IrregularDetails[] = [];
    if (irregularReductionMap.length > 0) {
      for (const irregularMap of irregularReductionMap) {
          IrregularItemsList.push(irregularMap);
      }
    }
    sortedList = this.commonService.sortIrregularList(IrregularItemsList);
    let isFirstItem = true;
    let netPercentage;
    let undertakingAmt;
    undertakingType === Constants.UNDERTAKING_TYPE_IU ? undertakingAmt = this.commonService.getUndertakingAmt() :
    undertakingAmt = this.commonService.getCuUndertakingAmt();
    for (const item of sortedList) {
      if (this.commonService.compareFirstDatewithAmendDate(item.variationFirstDate)) {
      let variationPct;
      if (item.variationPct !== '') {
        variationPct = parseInt(item.variationPct, 10);
      } else {
        //let variationAmt;
        const variationAmt = item.variationAmt;
        variationPct = ((parseInt(this.commonService.
          getNumberWithoutLanguageFormatting(variationAmt), 10)) / (this.commonService.
            getNumberWithoutLanguageFormatting(undertakingAmt))) * Constants.LENGTH_100;
      }
      if (isFirstItem && item.operationType === '02') {
        netPercentage = Constants.LENGTH_100 - variationPct;
        isFirstItem = false;
      } else if (item.operationType === '02') {
        netPercentage = netPercentage - variationPct;
      } else if (isFirstItem && item.operationType === '01') {
        netPercentage =  Constants.LENGTH_100 + variationPct;
        isFirstItem = false;
      } else if (item.operationType === '01') {
        netPercentage = netPercentage + variationPct;
      }
      if (netPercentage < 0) {
        irregularErrorList.push(item);
      }
     }
    }
    return irregularErrorList;
   }
}

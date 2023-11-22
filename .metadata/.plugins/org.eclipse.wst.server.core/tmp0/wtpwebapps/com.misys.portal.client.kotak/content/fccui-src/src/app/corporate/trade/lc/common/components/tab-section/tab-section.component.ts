import { CommonService } from '../../../../../../common/services/common.service';
import { LcConstant } from './../../model/constant';
import { LcReturnService } from '../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../../initiation/services/utility.service';
import { SaveDraftService } from '../../services/save-draft.service';
import { FilelistService } from '../../../initiation/services/filelist.service';
import { StepperParams } from '../../../../../../common/model/stepper-model';
import { ProductStateService } from '../../services/product-state.service';
import { FCCBase } from '../../../../../../base/model/fcc-base';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PdfGeneratorService } from '../../../../../../common/services/pdf-generator.service';
import { SelectItem } from 'primeng/api/selectitem';
import { TreeNode } from 'primeng/api/treenode';

@Component({
  selector: 'app-tab-section',
  templateUrl: './tab-section.component.html',
  styleUrls: ['./tab-section.component.scss']
})
export class LCTabSectionComponent extends FCCBase implements OnInit {
  @ViewChild('childaccessability') childaccessability: ElementRef;
  lcConstant = new LcConstant();
  types: SelectItem[];
  selectedType: string;
  sections = false;
  tasks = false;
  items: any;
  activeIndex = 0;
  value = 0;
  data1: TreeNode[];
  selectedNode: TreeNode;
  identifer = true;
  tickIdentifier = true;
  lcMode: any;
  receivedChildMessage = 'swift';
  savedTime = '';
  save = this.translateService.instant('save');
  showProgresssSpinner: any;
  showSavedTimeText: any;
  storeIndexValue = 0;
  lcNumber: any;
  lcNumberfinal: any;
  lcHeaderKey: any;
  modeValue: any;
  index: any;
  tenorFrequency: any;
  valuereset = 0;
  i: any;
  params: StepperParams = { productCode: '' };
  menuToggleFlag: any;
  mode: any;
  tnxTypeCode: any;
  refId: any;
  tnxId: any;
  option: any;
  subTnxTypeCode: any;
  templateId: any;
  operation: any;
  productCode: any;
  subProductCode: any;
  prodStatCode: any;
  tnxStatCode: any;
  productCodeValue: any;
  productEL = FccGlobalConstant.PRODUCT_EL;
  elNumber = '123456789';


  constructor(protected router: Router, protected leftSectionService: LeftSectionService ,
              protected utilityService: UtilityService, protected translateService: TranslateService,
              protected saveDraftService: SaveDraftService, protected lcReturnService: LcReturnService,
              protected fileList: FilelistService, protected elementRef: ElementRef, protected route: ActivatedRoute,
              protected commonService: CommonService, protected stateService: ProductStateService,
              protected pdfGeneratorService: PdfGeneratorService) {
                super();
              }

  ngOnInit() {
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    // read each queryparams and store it in variables for further computation
    this.mode = this.commonService.getQueryParametersFromKey('mode');
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey('tnxTypeCode');
    this.refId = this.commonService.getQueryParametersFromKey('refId');
    this.tnxId = this.commonService.getQueryParametersFromKey('tnxId');
    this.option = this.commonService.getQueryParametersFromKey('option');
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey('subTnxTypeCode');
    this.templateId = this.commonService.getQueryParametersFromKey('templateId');
    this.operation = this.commonService.getQueryParametersFromKey('operation');
    this.productCode = this.commonService.getQueryParametersFromKey('productCode');
    this.subProductCode = this.commonService.getQueryParametersFromKey('subProductCode');
    this.prodStatCode = this.commonService.getQueryParametersFromKey('prodStatCode');
    this.tnxStatCode = this.commonService.getQueryParametersFromKey('tnxStatCode');
    this.stateService.initializeState(this.productCode);
    this.subjectInitialize();
    this.utilityService.resetForm();
    this.fileList.resetList();
    this.modeValue = this.router.url.split(';');
    this.getEditModeUrl();
    if (this.mode === 'draft') {
      this.saveDraftService.generatedLcNumber = this.refId;
      this.lcHeaderKey = this.translateService.instant('lcHeaderEdit');
      this.utilityService.putMasterdata('mode', this.mode);
      this.utilityService.putSectionFlag(FccGlobalConstant.GENERAL_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.APPLICANT_BENEFICIARY, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.BANK_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.AMOUNT_CHARGE_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.PAYMENT_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.SHIPMENT_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.NARRATIVE_DETAILS, false);
      this.utilityService.putSectionFlag(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, false);
      this.lcReturnService.getLCTransactionData(this.tnxId).subscribe(response => {
        if (response) {
          // general details start
          this.getRequestType(response.lcType.transferable, response.lcType.revolving, response.generalDetails.requestType);
          this.getLCIssueBy(response.lcDetails.issueBy);
          this.getApplicableRule(response.lcDetails.expiryDate, response.lcDetails.applicableRule.id,
                          response.lcDetails.applicableRule.narrative);
          this.utilityService.putMasterdata('placeOfExpiry', response.expiryPlace );
          this.getConfirmationInstruction(response.confirmation.instruction);
          this.getReference(response.beneficiary.reference, response.beneficiary.reference);
          // applicant and beneficiary starts
          this.getApplicantDetails(response.applicant.entity, response.applicant.name, response.applicant.address.line1,
                      response.applicant.address.line2, response.applicant.address.line3);
          this.getAlternateApplicant(response.alternateApplicant, response.alternateApplicant.name, response.alternateApplicant.line1,
              response.alternateApplicant.line2, response.alternateApplicant.country);
          this.getBeneficiaryDetails(response.beneficiary.name, response.beneficiary.address.line1, response.beneficiary.address.line2,
                      response.beneficiary.address.line3, response.beneficiary.country);
          // bank details
          this.utilityService.putMasterdata('bankNameList', response.issuingBank.bankShortName );
          this.utilityService.putMasterdata('issuerReferenceList', response.issuingBank.issuersReference);
          this.getAdvisingBank(response.advisingBank.bicCode, response.advisingBank.name, response.advisingBank.address.line1,
            response.advisingBank.address.line2, response.advisingBank.address.line3);
          this.getAdviseThroughBank(response.adviseThroughBank.bicCode, response.adviseThroughBank.name,
            response.adviseThroughBank.address.line1, response.adviseThroughBank.address.line2, response.adviseThroughBank.address.line3);
          this.getReqConfirmatioPrtyRole(response.confirmation, response.confirmation.requestedConfirmationPartyRole);
          this.getConfirmationPartyDetails(response.confirmation, response.confirmation.requestedConfirmationParty.bicCode,
            response.confirmation.requestedConfirmationParty.name, response.confirmation.requestedConfirmationParty.address.line1,
            response.confirmation.requestedConfirmationParty.address.line2, response.confirmation.requestedConfirmationParty.address.line3);
          // amount and charge details
          this.getAmountDetails(response.amount.currency, response.amount.amount,
            response.amountTolerance.minPercentAmountTolerance, response.amountTolerance.maxPercentAmountTolerance);
          this.getIssuanceCharges(response.chargeDetail.issuanceChargesPayableBy);
          this.utilityService.putMasterdata('conf', 'confb');
          this.utilityService.putMasterdata('addamt', response.narrative.additionalAmount);
          this.getLCRevolving(response.revolving.period, response.revolving.frequency, response.revolving.revolutions,
            response.revolving.noticeDays, response.revolving.cumulative);
          // payment details
          this.getPaymentDetails(response.paymentDetails.creditAvailableWith, response.paymentDetails.bankName,
            response.paymentDetails.address.line1, response.paymentDetails.address.line2, response.paymentDetails.address.line3);
          this.getCreditAvailableByDetails(response.paymentDetails.creditAvailableBy);
          this.getTenorDetails(response.paymentDetails.tenor.period, response.paymentDetails.tenor.frequency,
              response.paymentDetails.tenor.fromAfter, response.paymentDetails.tenor.start, response.paymentDetails.tenor.maturityDate);
          this.getMixedDetails(response.paymentDetails.mixedPayDetail);
          this.utilityService.putMasterdata('inputDraweeDetail', response.paymentDetails.bankName);
          // shipment details
          this.getShipmentDetails(response.shipment.from, response.shipment.to,
              response.shipment.portOfLoading, response.shipment.portOfDischarge, response.shipment.date, response.shipment.period);
          this.getPartialShipmentDetails(response.paymentDetails.partialShipment);
          this.getTransShipmentDetails(response.paymentDetails.transhipment);
          this.utilityService.putMasterdata('purchaseTermsValue', { label : response.shipment.incoTerms ,
           shortName : response.shipment.incoTerms }
           );
          this.utilityService.putMasterdata('incoTermsRules', { label : response.shipment.incoRules ,
           shortName : response.shipment.incoRules }
           );
          this.utilityService.putMasterdata('namedPlace', response.shipment.incoPlace);
          // narrative details
          this.getNarrativeDetails(response.narrative.goodsDescription, response.narrative.documentsRequired,
            response.narrative.additionalConditions, response.narrative.specialPaymentConditionsForBeneficiary,
            response.narrative.presentationPeriod.presentationDays, response.narrative.presentationPeriod.presentationPeriodNarrative);
          // instructions for bank only
          this.getInstructionsBank(response.bankInstructions.principalAccount.number, response.bankInstructions.feeAccount.number,
                response.narrative.additionalConditions);
        }
        this.router.navigate([FccGlobalConstant.LC_GENERAL_DETAILS]);
      });
    }
    this.checkpageType();
    // this.items = this.leftSectionService.getSections(FccGlobalConstant.PRODUCT_LC);
    this.params.productCode = FccGlobalConstant.PRODUCT_LC;
    this.leftSectionService.progressBarMapping(this.items);
    if (this.productCodeValue === FccGlobalConstant.PRODUCT_EL) {
      // this.items = this.leftSectionService.getSectionArray(FccGlobalConstant.PRODUCT_EL);
      this.params.productCode = FccGlobalConstant.PRODUCT_EL;
    } else {
      // this.items = this.leftSectionService.getSectionArray(FccGlobalConstant.PRODUCT_LC);
      this.params.productCode = FccGlobalConstant.PRODUCT_LC;
    }

    // this.leftSectionService.progressBarMapping();
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.value = data;
      }
    );

    this.sections = true;
    this.selectedType = 'Sections';

    this.types = [
      { label: `${this.translateService.instant('sections')}`, value: 'Sections' }
    ];
    this.lcMode = localStorage.getItem('lcmode');
    if (CommonService.isTemplateCreation) {
      this.lcHeaderKey = this.translateService.instant('templateHeaderNew');
    }
  }

   checkpageType() {
     const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
     if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      CommonService.isTemplateCreation = false;
      this.lcHeaderKey = this.translateService.instant('lcHeaderAmend');
      this.utilityService.putMasterdata('mode', '');
      this.router.navigate([FccGlobalConstant.LC_GENERAL_DETAILS]);
     } else if (this.option === 'TEMPLATE') {
      CommonService.isTemplateCreation = true;
      this.lcHeaderKey = this.translateService.instant('lcHeaderTemplate');
      // this.router.navigate(['createTemplate/generalDetails']);
    } else {
      CommonService.isTemplateCreation = false;
      this.lcHeaderKey = this.translateService.instant('lcHeaderNew');
      this.utilityService.putMasterdata('mode', '');
      this.router.navigate([FccGlobalConstant.LC_GENERAL_DETAILS]);
    }
  }

  updateIndexEvent(event: StepperSelectionEvent) {
    if (!CommonService.isTemplateCreation) {
      this.saveDraftService.identifySectionNameForSave(this.items[event.previouslySelectedIndex].target);
    }
    this.storeIndexValue = event.selectedIndex;

  }

  ngOnDestroy() {
    this.stateService.clearState();
    if (!CommonService.isTemplateCreation) {
      this.lcNumber = this.saveDraftService.generatedLcNumber;
      this.saveDraftService.generatedLcNumber = '';
      if (this.lcNumber !== undefined && this.lcNumber !== '' && this.lcNumber !== null) {
        this.lcNumberfinal = this.lcNumber;
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.lcNumber}`,
          detail: this.translateService.instant('toasterMessage')
        };
        this.saveDraftService.showToasterMessage(tosterObj);
      }
      this.saveDraftService.initializeSaveStatus();
      this.resetLCForm();
    }
  }



// Below function is to choose the tab selection on the left panel of the form
  onOptionClick() {
    this.sections = false;
    this.tasks = false;
    if (this.selectedType === 'Sections') {
      this.sections = true;
    }

    if (this.selectedType === 'Tasks') {
      this.tasks = true;
    }
  }

  onActivate(componentReference) {
    componentReference.messageToEmit.subscribe((data) => {
      this.receivedChildMessage = data;
    });
 }

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 handleClick(event) {
  this.saveDraftService.identifySectionNameForSave(this.items[this.storeIndexValue].target);
}

subjectInitialize() {
 this.saveDraftService.saveUrlStatus.subscribe(
   data => {
     this.save = data;
   }
 );
 this.saveDraftService.spinnerShow.subscribe(
   data => {
     this.showProgresssSpinner = data;
   }
 );
 this.saveDraftService.savedTimeText.subscribe(
   data => {
     this.savedTime = data;
   }
 );

 this.saveDraftService.savedTimeTextShow.subscribe(
   data => {
     this.showSavedTimeText = data;
   }
 );

}

// TODO remove
// getSectionName(index) {
//   const label = this.items[index].id;
//   if (label === 'generalDetailsComponent') {
//   return FccGlobalConstant.GENERAL_DETAILS;
//   }
//   if (label === 'applicantBeneficiaryComponent') {
//   return FccGlobalConstant.APPLICANT_BENEFICIARY;
//   }
//   if (label === 'fccBankDetailsComponent') {
//   return FccGlobalConstant.BANK_DETAILS;
//   }
//   if (label === 'amountChargeDetailsComponent') {
//   return FccGlobalConstant.AMOUNT_CHARGE_DETAILS;
//   }
//   if (label === 'paymentDetailsComponent') {
//     return FccGlobalConstant.PAYMENT_DETAILS;
//   }
//   if (label === 'shipmentDetailsComponent') {
//     return FccGlobalConstant.SHIPMENT_DETAILS;
//   }
//   if (label === 'narrativeDetailsComponent') {
//     return FccGlobalConstant.NARRATIVE_DETAILS;
//   }
//   if (label === 'instructionsToBankComponent') {
//     return FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY;
//   }
// }

 resetLCForm() {
      this.leftSectionService.progressBarData.subscribe(
        data => {
          this.valuereset = data;
        }
      );
      this.leftSectionService.progressBarData.next(0);
  //     for (this.i of this.leftSectionService.items) {
  //       this.i.styleClass = '';
  //     }

    }

  accessability(e, i) {
    const keycodeIs = e.which || e.keyCode;
    if (i !== null && i !== undefined) {
      if (keycodeIs === this.lcConstant.nine) {
        this.elementRef.nativeElement.classList.add(FccGlobalConstant.OUTLINE_BORDER);
      }
      if (e.shiftKey || keycodeIs === this.lcConstant.nine) {
        this.elementRef.nativeElement.classList.add(FccGlobalConstant.OUTLINE_BORDER);
      }
      if (keycodeIs !== this.lcConstant.nine && e.shiftKey) {
        this.elementRef.nativeElement.classList.remove(FccGlobalConstant.OUTLINE_BORDER);
      }
      if (keycodeIs === this.lcConstant.thirteen) {
        this.childaccessability.nativeElement.focus();
      }
      if (keycodeIs === this.lcConstant.twentySeven) {
        this.elementRef.nativeElement.classList.remove(FccGlobalConstant.OUTLINE_BORDER);
      }
    }
  }

  getEditModeUrl() {
    for (this.index = 0; this.index < this.modeValue.length; this.index++) {
      if (this.modeValue[this.index].indexOf('mode') === 0) {
        this.mode = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf('tnxId') === 0) {
        this.tnxId = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf('refId') === 0) {
        this.refId = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf('option') === 0) {
        this.option = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf('templateName') === 0) {
        this.option = 'TEMPLATE';
      }
      if (this.modeValue[this.index].indexOf('productCode') > -1) {
        this.productCodeValue = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf(FccGlobalConstant.PRODUCT_EL) > -1 ||
      this.modeValue[this.index].indexOf(FccGlobalConstant.PRODUCT_LC) > -1) {
        this.productCodeValue = this.modeValue[this.index].split('/')[1];
      }


    }
  }

  getTransShipmentDetails(tranShipment) {
    if (tranShipment !== undefined) {
      if (tranShipment === 'ALLOWED') {
        this.utilityService.putMasterdata('transhipmentvalue', 'allowed');
      } else if (tranShipment === 'NOT-ALLOWED') {
        this.utilityService.putMasterdata('transhipmentvalue', 'notallowed');
      } else if (tranShipment === 'CONDITIONAL') {
        this.utilityService.putMasterdata('transhipmentvalue', 'conditional');
      }
    }
  }

  getPartialShipmentDetails(partialshipment) {
    if (partialshipment !== undefined) {
      if (partialshipment === 'ALLOWED') {
        this.utilityService.putMasterdata('partialshipmentvalue', 'allowed');
      } else if (partialshipment === 'NOT-ALLOWED') {
        this.utilityService.putMasterdata('partialshipmentvalue', 'notallowed');
      } else if (partialshipment === 'CONDITIONAL') {
        this.utilityService.putMasterdata('partialshipmentvalue', 'conditional');
      }
    }
  }

  getCreditAvailableByDetails(creditAvailableBy) {
    if (creditAvailableBy !== undefined) {
      if (creditAvailableBy === 'SIGHT-PAYMENT') {
        this.utilityService.putMasterdata('creditAvailableOptions', 'Payment');
      } else if (creditAvailableBy === 'ACCEPTANCE') {
        this.utilityService.putMasterdata('creditAvailableOptions', 'Acceptance');
      } else if (creditAvailableBy === 'NEGOTIATION') {
        this.utilityService.putMasterdata('creditAvailableOptions', 'Negotiation');
      } else if (creditAvailableBy === 'DEFERRED-PAYMENT') {
        this.utilityService.putMasterdata('creditAvailableOptions', 'Deferred Payment');
      } else if (creditAvailableBy === 'MIXED-PAYMENT') {
        this.utilityService.putMasterdata('creditAvailableOptions', 'Mixed Payment');
      }
    }
  }

  getReqConfirmatioPrtyRole(confirmationResp, requestedConfirmationPartyRole) {
    if (confirmationResp && requestedConfirmationPartyRole !== undefined) {
      if (requestedConfirmationPartyRole === 'ADVISING-BANK') {
        this.utilityService.putMasterdata('counterPartyList', 'Advising Bank');
      } else if (requestedConfirmationPartyRole === 'ADVISE-THROUGH-BANK') {
        this.utilityService.putMasterdata('counterPartyList', 'Advising Through');
      } else if (requestedConfirmationPartyRole === 'OTHER') {
        this.utilityService.putMasterdata('counterPartyList', 'Other');
      }
    }
  }

  getConfirmationInstruction(instruction) {
    if (instruction !== undefined) {
      if (instruction === 'CONFIRM') {
        this.utilityService.putMasterdata('confirmation', 'confirm');
      } else if (instruction === 'MAY-ADD') {
        this.utilityService.putMasterdata('confirmation', 'mayadd');
      } else if (instruction === 'WITHOUT') {
        this.utilityService.putMasterdata('confirmation', 'without');
      }
    }
  }

  getLCIssueBy(issueBy) {
    if (issueBy !== undefined) {
      if (issueBy === 'SWIFT') {
        this.utilityService.putMasterdata('transmissionMode', 'swift');
      } else if (issueBy === 'COURIER') {
        this.utilityService.putMasterdata('transmissionMode', 'courier');
      } else if (issueBy === 'TELEX') {
        this.utilityService.putMasterdata('transmissionMode', 'telex');
      }
    }
  }

  getTenorDetails(period, frequency, fromAfter, start, maturityDate) {
    if (period !== undefined || frequency !== undefined || fromAfter !== undefined || start !== undefined) {
        this.utilityService.putMasterdata('paymentDraftWidget', 'Calculated Maturity Date');
        this.utilityService.putMasterdata('paymentDraftWidgetData', '3');
        this.utilityService.putMasterdata('inputValNum', period);
        this.utilityService.putMasterdata('inputDays', frequency);
        this.utilityService.putMasterdata('inputFrom', fromAfter);
        this.utilityService.putMasterdata('inputSelect', start);
    } else if (maturityDate !== undefined) {
        this.utilityService.putMasterdata('paymentDraftWidget', 'Fixed Maturity Date');
        this.utilityService.putMasterdata('paymentDraftWidgetData', '2');
        this.utilityService.putMasterdata('fixedMaturityPaymentDate', this.utilityService.transformDateFormat(maturityDate));
    } else {
        this.utilityService.putMasterdata('paymentDraftWidget', 'Sight');
        this.utilityService.putMasterdata('paymentDraftWidgetData', '1');
    }
  }

  getIssuanceCharges(issuanceChargesPayableBy) {
    this.utilityService.putMasterdata('iss', (issuanceChargesPayableBy === 'APPLICANT') ?
                                                    'IssA' : 'IssB');
    this.utilityService.putMasterdata('corrc', (issuanceChargesPayableBy === 'APPLICANT') ?
                                                    'CorrA' : 'CorrB');
  }

  getAlternateApplicant(alternateApplicantResp, name, line1, line2, country) {
    if (alternateApplicantResp && (name || line1 || line2 || country)) {
      this.utilityService.putMasterdata('applicantToggle', true);
      this.utilityService.putMasterdata('altApplName', name);
      this.utilityService.putMasterdata('altApplFirstAddress', line1);
      this.utilityService.putMasterdata('altApplSecondAddress', line2);
      this.utilityService.putMasterdata('altApplThirdAddress', '');
      this.utilityService.putMasterdata('altCountryDrop', country);
    }
  }

  getRequestType(transferable, revolving, requestType) {
    const featureoflcvalues = [];
    if (transferable === false) {
      featureoflcvalues.push('nonTransferable');
    }
    if (revolving === true) {
      featureoflcvalues.push('revolving');
    }
    featureoflcvalues.push('irrevocable');
    this.utilityService.putMasterdata('requestOptionsLC', (requestType !== undefined) ? requestType : 'regular');
    this.utilityService.putMasterdata('featureofLCOptions', featureoflcvalues);
  }

  getLCRevolving(period, frequency, revolutions, noticeDays, cumulative) {
    this.utilityService.putMasterdata('revolvePeriod', period);
    if (frequency !== undefined) {
      const freq = frequency === 'D' ? 'Days' : 'Months';
      this.utilityService.putMasterdata('revolveFrequency', { label: freq , shortName: freq });
    }
    this.utilityService.putMasterdata('numberOfTimesToRevolve', revolutions);
    this.utilityService.putMasterdata('noticeDays', noticeDays);
    this.utilityService.putMasterdata('cumulativeCheckbox', (cumulative === true) ?
                                                                          ['cumulativeCheckbox', 'cumulative'] : '');
  }

  getApplicantDetails(entity, name, line1, line2, line3) {
    this.utilityService.putMasterdata('applicantEntity', entity);
    this.utilityService.putMasterdata('applicantName', name);
    this.utilityService.putMasterdata('applicantFirstAddress', line1);
    this.utilityService.putMasterdata('applicantSecondAddress', line2);
    this.utilityService.putMasterdata('applicantThirdAddress', line3);
  }

  getBeneficiaryDetails(name, line1, line2, line3, country) {
    this.utilityService.putMasterdata('beneficiaryName', name);
    this.utilityService.putMasterdata('beneficiaryFirstAddress', line1);
    this.utilityService.putMasterdata('beneficiarySecondAddress', line2);
    this.utilityService.putMasterdata('beneficiaryThirdAddress', line3);
    this.utilityService.putMasterdata('beneficiaryCountry', country);
  }

  getInstructionsBank(principalAccount, feeAccount, additionalConditions) {
    this.utilityService.putMasterdata('principalAct', principalAccount);
    this.utilityService.putMasterdata('feeAct', feeAccount);
    this.utilityService.putMasterdata('otherInst', additionalConditions);
  }

  getNarrativeDetails(goodsDescription, documentsRequired, additionalConditions,
                      specialPaymentConditionsForBeneficiary, presentationDays, presentationPeriodNarrative) {
    this.utilityService.putMasterdata('descOfGoodsText', goodsDescription);
    this.utilityService.putMasterdata('docRequiredText', documentsRequired);
    this.utilityService.putMasterdata('addInstructionText', additionalConditions);
    this.utilityService.putMasterdata('splPaymentBeneText', specialPaymentConditionsForBeneficiary);
    this.utilityService.putMasterdata('nbdays', presentationDays);
    this.utilityService.putMasterdata('periodOfPresentationText', presentationPeriodNarrative);
  }

  getShipmentDetails(from, to, portOfLoading, portOfDischarge, date, period) {
    this.utilityService.putMasterdata('shipmentForm', from);
    this.utilityService.putMasterdata('shipmentTo', to);
    this.utilityService.putMasterdata('shipmentPlaceOfLoading', portOfLoading);
    this.utilityService.putMasterdata('shipmentPlaceOfDischarge', portOfDischarge);
    if (date) {
      this.utilityService.putMasterdata('shipmentLastDate', this.utilityService.transformDateFormat(date));
    }
    this.utilityService.putMasterdata('shipmentPeriodText', period);
  }

  getMixedDetails(mixedPayDetail) {
    if (mixedPayDetail !== undefined) {
      this.utilityService.putMasterdata('paymentDraftOptions', '');
      this.utilityService.putMasterdata('paymentDraftWidgetData', '');
      this.utilityService.putMasterdata('inputTextAreaMixPayment', mixedPayDetail);
    }
  }

  getPaymentDetails(creditAvailableWith, bankName, line1, line2, line3) {
    this.utilityService.putMasterdata('paymentDetailsBankEntity', creditAvailableWith);
    this.utilityService.putMasterdata('paymentDetailsBankName', bankName);
    this.utilityService.putMasterdata('paymentDetailsBankFirstAddress', line1);
    this.utilityService.putMasterdata('paymentDetailsBankSecondAddress', line2);
    this.utilityService.putMasterdata('paymentDetailsBankThirdAddress', line3);
  }

  getAdviseThroughBank(bicCode, name, line1, line2, line3) {
    this.utilityService.putMasterdata('advThroughswiftCode', bicCode);
    this.utilityService.putMasterdata('advThroughswiftCodeBankName', name);
    this.utilityService.putMasterdata('advThroughswiftCodeBankFirstAddress', line1);
    this.utilityService.putMasterdata('advThroughswiftCodeBankSecondAddress', line2);
    this.utilityService.putMasterdata('advThroughswiftCodeBankThirdAddress', line3);
  }

  getAdvisingBank(bicCodeAdviseBank, nameAdviseBank, line1AdviseBank, line2AdviseBank, line3AdviseBank) {
    this.utilityService.putMasterdata('advisingswiftCode', bicCodeAdviseBank);
    this.utilityService.putMasterdata('advisingBankName', nameAdviseBank);
    this.utilityService.putMasterdata('advisingFirstAddress', line1AdviseBank);
    this.utilityService.putMasterdata('advisingSecondAddress', line2AdviseBank);
    this.utilityService.putMasterdata('advisingThirdAddress', line3AdviseBank);
  }

  getApplicableRule(expiryDate, id, narrative) {
    if (expiryDate !== undefined) {
      this.utilityService.putMasterdata('expiryDate', this.utilityService.transformStringtoDate(expiryDate));
    }
    this.utilityService.putMasterdata('applicableRulesOptions', id);
    if (narrative !== undefined) {
      this.utilityService.putMasterdata('otherApplicableRules', narrative);
    }
  }

  getReference(senderReference, beneficiaryReference) {
    if (senderReference !== undefined) {
      this.utilityService.putMasterdata('customerReference', senderReference);
    }
    if (beneficiaryReference !== undefined) {
      this.utilityService.putMasterdata('benefeciaryReference', beneficiaryReference);
    }
  }

  getConfirmationPartyDetails(partyResp, partyBic, partyName, partyAdd1, partyAdd2, partyAdd3) {
    if (partyResp) {
      this.utilityService.putMasterdata('confirmationPartySwiftCode', partyBic);
      this.utilityService.putMasterdata('confirmationName', partyName);
      this.utilityService.putMasterdata('confirmationFirstAddress', partyAdd1);
      this.utilityService.putMasterdata('confirmationSecondAddress', partyAdd2);
      this.utilityService.putMasterdata('confirmationThirdAddress', partyAdd3);
    }
  }

  getAmountDetails(currency, amount, minPercentAmountTolerance, maxPercentAmountTolerance) {
    this.utilityService.putMasterdata('currency', currency);
    this.utilityService.putMasterdata('amount', amount);
    this.utilityService.putMasterdata('percp', minPercentAmountTolerance);
    this.utilityService.putMasterdata('percm', maxPercentAmountTolerance);
  }

}

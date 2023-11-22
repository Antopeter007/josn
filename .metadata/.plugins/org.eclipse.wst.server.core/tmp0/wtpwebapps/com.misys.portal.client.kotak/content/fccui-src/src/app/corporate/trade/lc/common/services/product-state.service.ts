import { Injectable } from "@angular/core";

import {
  FCCFormControl,
  FCCFormGroup,
} from "../../../../../../app/base/model/fcc-control.model";
import { FccGlobalConstant } from "../../../../../../app/common/core/fcc-global-constants";
import { CommonService } from "../../../../../../app/common/services/common.service";
import { FormModelService } from "../../../../../../app/common/services/form-model.service";
import { CurrentProductParams } from "../../../../../common/model/params-model";
import { FormControlService } from "../../initiation/services/form-control.service";
import { PreviewService } from "../../initiation/services/preview.service";
import { TransactionDetails } from "./../../../../../../app/common/model/TransactionDetails";
import { EnumMapping } from "./../../../../../base/model/enum-mapping";
import { TransactionDetailsMap } from "./transaction-map.service";

@Injectable({
  providedIn: "root",
})
export class ProductStateService {
  constructor(
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected commonServices: CommonService,
    protected preiewService: PreviewService,
    protected transactionDetailsMap: TransactionDetailsMap
  ) {}
  protected masterState: FCCFormGroup; // master State
  protected masterSectionList: string[] = [];
  protected stateData: FCCFormGroup; // Parent Form
  protected sectionList: string[] = [];
  protected productModel: any;
  protected eventModel: any;
  protected screenName: string;
  protected productModelMaster: any;
  loadedStateParams: CurrentProductParams;
  isMaster: boolean;
  // new changes
  protected eventState: FCCFormGroup; //  event State
  protected amendState: FCCFormGroup; // Amend diff state
  protected amendSectionList: string[] = [];
  protected eventSectionList: string[] = [];
  protected transactionDetail: TransactionDetails;
  protected stateType: string;
  protected stateId: string;
  protected STATE_TYPE = "stateType";
  private autoSaveConfig: any;
  private autoSaveCreateFlag = true;
  private savedTimestamp: any;
  autosaveProductCode: any;
  onlineHelpMap: Map<any, any> = new Map();
  eventInqurySection = [
    "eventDetails",
    "feesAndCharges",
    "secondBeneDetails",
    "amountDetailsEvents",
    "transferDetailsEvents",
    "instToBank",
    "bankMessageEvents",
    FccGlobalConstant.RELEASE_INSTRUCTION_SECTION,
    "bankInstructionsHeader",
    "assigneeDetails",
    "customerAttachments",
    FccGlobalConstant.ADVICE_DISCREPANCY,
    FccGlobalConstant.PREVIOUS_ATTACHMENTS,
    FccGlobalConstant.BANK_ATTACHMENT,
    FccGlobalConstant.TRANSACTION_DETAILS
  ];

  initializeState(
    productCode: string,
    master = false,
    reInit = true,
    eventTypeCode?: string,
    subTnxTypeCode?: string,
    parent = false,
    stateType?: string,
    tnxId?: any
  ) {
    this.transactionDetail =
      this.transactionDetailsMap.getSingleTransaction(tnxId);
    this.isMaster = master;
    this.stateType = stateType;
    this.stateId = tnxId;
    const operation =
      this.commonServices.getQueryParametersFromKey("operation");
    const option = this.commonServices.getQueryParametersFromKey("option");
    let subTnxType =
      this.commonServices.getQueryParametersFromKey("subTnxTypeCode");
    const mode = this.commonServices.getQueryParametersFromKey("mode");
    const tnxTypeCode =
      this.commonServices.getQueryParametersFromKey("tnxTypeCode");
    if (reInit) {
      if (stateType !== EnumMapping.stateTypeEnum.EVENTSTATE) {
        this.stateData = new FCCFormGroup({});
        this.stateData[this.STATE_TYPE] = this.stateType;
      } else {
        this.eventState = new FCCFormGroup({});
        this.eventState[this.STATE_TYPE] = this.stateType;
      }
      if (stateType === EnumMapping.stateTypeEnum.AMENDSTATE) {
        this.amendState = new FCCFormGroup({});
      }

      const eventTab =
        this.commonServices.getQueryParametersFromKey("eventTab");

      if (operation !== undefined && operation === "LIST_INQUIRY") {
        if (eventTab) {
          subTnxType = subTnxTypeCode;
        } else if (this.transactionDetail !== undefined) {
          subTnxType = this.transactionDetail.subTnxType;
        }
      }

      this.setScreenName();
      if (
        operation === "LIST_INQUIRY" ||
        operation === "PREVIEW" ||
        operation === "PDF"
      ) {
        this.addControltoStateData(
          this.getEventModel(),
          option,
          subTnxType,
          mode,
          tnxTypeCode
        );
      }

      this.addControltoStateData(
        this.getProductModel(),
        option,
        subTnxType,
        mode,
        tnxTypeCode
      );
    }

    if (master && !parent) {
      this.initializeMasterState();
    }
    if (this.stateType === EnumMapping.stateTypeEnum.AMENDSTATE) {
      this.initializeAmendState(productCode);
    }
    if (parent && operation !== "LIST_INQUIRY" && operation !== "PREVIEW") {
      if (this.getProductModel(true)) {
        // this.addControltoMasterStateData(this.getEventModel(), option, subTnxType, mode, tnxTypeCode);
        // this.addControltoMasterStateData(this.getProductModel(true), option, subTnxType, mode, tnxTypeCode);
        this.initializeParentTransactionState(
          productCode,
          eventTypeCode,
          subTnxTypeCode,
          parent
        );
      } else {
        this.formModelService
          .getFormModel(productCode, eventTypeCode, subTnxTypeCode)
          .subscribe((parentModelJson) => {
            this.initializeProductModel(parentModelJson, true);
            // this.addControltoMasterStateData(this.getEventModel(), option, subTnxType, mode, tnxTypeCode);
            // this.addControltoMasterStateData(parentModelJson, option, subTnxType, mode, tnxTypeCode);
            this.initializeParentTransactionState(
              productCode,
              eventTypeCode,
              subTnxTypeCode,
              parent
            );
          });
      }
    }
  }
  addControltoStateData(modelJson, option, subTnxType, mode, tnxTypeCode) {
    Object.keys(modelJson).forEach((section) => {
      const renderDynamicSection =
        modelJson[section].rendered !== undefined
          ? modelJson[section].rendered
          : true;
      if (this.stateType === EnumMapping.stateTypeEnum.EVENTSTATE) {
        if (
          this.eventSectionList.indexOf(section) === -1 &&
          typeof modelJson[section] === "object"
        ) {
          const addSection = this.checkApplicableSections(
            modelJson[section],
            option,
            subTnxType,
            mode,
            tnxTypeCode,
            this.stateId
          );
          if (addSection) {
            this.eventSectionList.push(section);
            const control = new FCCFormGroup({});
            this.eventState.addControl(section, control);
          }
        }
      } else {
        if (
          this.sectionList.indexOf(section) === -1 &&
          typeof modelJson[section] === "object"
        ) {
          const addSection = this.checkApplicableSections(
            modelJson[section],
            option,
            subTnxType,
            mode,
            tnxTypeCode,
            this.stateId
          );
          if (addSection && renderDynamicSection) {
            this.sectionList.push(section);
            const control = new FCCFormGroup({});
            this.stateData.addControl(section, control);
            this.onlineHelpMap.set(section, modelJson[section].helpId);
          }
        }
      }
    });
  }

  // To fetch parent transaction and assign to master state
  addControltoMasterStateData(
    modelJson,
    option,
    subTnxType,
    mode,
    tnxTypeCode
  ) {
    Object.keys(modelJson).forEach((section) => {
      if (
        this.masterSectionList.indexOf(section) === -1 &&
        typeof modelJson[section] === "object"
      ) {
        const addSection = this.checkApplicableSections(
          modelJson[section],
          option,
          subTnxType,
          mode,
          tnxTypeCode,
          this.stateId
        );
        if (addSection) {
          this.masterSectionList.push(section);
          const control = new FCCFormGroup({});
          this.masterState.addControl(section, control);
        }
      }
    });
  }

  initializeMasterState() {
    this.setScreenName(true);
    this.masterState = new FCCFormGroup({});
    this.masterState[this.STATE_TYPE] = this.stateType;
    const option = this.commonServices.getQueryParametersFromKey("option");
    const subTnxType =
      this.commonServices.getQueryParametersFromKey("subTnxTypeCode");
    const mode = this.commonServices.getQueryParametersFromKey("mode");
    const tnxTypeCode = this.commonServices.getQueryParametersFromKey(
      FccGlobalConstant.TRANSACTION_TYPE_CODE
    );
    Object.keys(this.getProductModel(true)).forEach((section) => {
      const renderDynamicSection =
        this.getProductModel(true)[section].rendered !== undefined
          ? this.getProductModel(true)[section].rendered
          : true;
      if (
        this.masterSectionList.indexOf(section) === -1 &&
        typeof this.getProductModel(true)[section] === "object"
      ) {
        const addSection = this.checkApplicableSections(
          this.getProductModel(true)[section],
          option,
          subTnxType,
          mode,
          tnxTypeCode,
          this.stateId
        );
        if (
          addSection &&
          renderDynamicSection &&
          !(
            this.commonServices.viewPopupFlag && section === "fileUploadDetails"
          )
        ) {
          this.masterSectionList.push(section);
          const control = new FCCFormGroup({});
          this.masterState.addControl(section, control);
        }
      }
    });
    // if (this.getProductModel(true)) {
    //   this.formModelService.getFormModel(productCode, eventTypeCode, subTnxTypeCode).subscribe(modelJson => {
    //     this.initializeProductModel(modelJson, true);
    //     this.addControltoMasterStateData(modelJson, option, subTnxType, mode, tnxTypeCode);
    //   });
    // } else {
    //   this.addControltoMasterStateData(this.getProductModel(true), option, subTnxType, mode, tnxTypeCode);
    // }
  }
  /**
   * Initialises the state for Amend draft scenario
   */
  initializeAmendState(productCode: string): void {
    this.amendState = new FCCFormGroup({});
    const option = this.commonServices.getQueryParametersFromKey("option");
    const subTnxType =
      this.commonServices.getQueryParametersFromKey("subTnxTypeCode");
    const mode = this.commonServices.getQueryParametersFromKey("mode");
    const tnxTypeCode = this.commonServices.getQueryParametersFromKey("mode");
    if (this.getProductModel()) {
      this.addControltoAmendState(
        this.getProductModel(),
        option,
        subTnxType,
        mode,
        tnxTypeCode
      );
    } else {
      this.formModelService.getFormModel(productCode).subscribe(() => {
        //eslint : no-empty-function
      });
    }
  }

  /**
   * Add controls to amend diff state
   */
  addControltoAmendState(
    modelJson: any,
    option: any,
    subTnxType: any,
    mode: any,
    tnxTypeCode: any
  ) {
    Object.keys(modelJson).forEach((section) => {
      if (
        this.amendSectionList.indexOf(section) === -1 &&
        typeof modelJson[section] === "object"
      ) {
        const addSection = this.checkApplicableSections(
          modelJson[section],
          option,
          subTnxType,
          mode,
          tnxTypeCode,
          this.stateId
        );
        if (addSection) {
          this.amendSectionList.push(section);
          const control = new FCCFormGroup({});
          this.amendState.addControl(section, control);
        }
      }
    });
  }

  // hold event and parent transaction
  initializeParentTransactionState(
    productCode: string,
    eventTypeCode?: string,
    subTnxTypeCode?: string,
    parent = false
  ) {
    this.setScreenName(true);
    const option = this.commonServices.getQueryParametersFromKey("option");
    const subTnxType =
      this.commonServices.getQueryParametersFromKey("subTnxTypeCode");
    const mode = this.commonServices.getQueryParametersFromKey("mode");
    const tnxTypeCode =
      this.commonServices.getQueryParametersFromKey("tnxTypeCode");
    // this.initializeProductModel(productCode, eventTypeCode, subTnxTypeCode, true);
    // this.initializeEventModel();
    Object.keys(this.getEventModel()).forEach((section) => {
      if (
        this.masterSectionList.indexOf(section) === -1 &&
        typeof this.getEventModel()[section] === "object"
      ) {
        const addSection = this.checkApplicableSections(
          this.getEventModel()[section],
          option,
          subTnxType,
          mode,
          tnxTypeCode,
          this.stateId,
          parent
        );
        if (addSection) {
          this.masterSectionList.push(section);
          const control = new FCCFormGroup({});
          this.masterState.addControl(section, control);
        }
      }
    });
    Object.keys(this.getProductModel(true)).forEach((section) => {
      if (
        this.masterSectionList.indexOf(section) === -1 &&
        typeof this.getProductModel(true)[section] === "object"
      ) {
        const addSection = this.checkApplicableSections(
          this.getProductModel(true)[section],
          option,
          subTnxType,
          mode,
          tnxTypeCode,
          this.stateId
        );
        if (
          addSection &&
          !(
            this.commonServices.viewPopupFlag && section === "fileUploadDetails"
          )
        ) {
          this.masterSectionList.push(section);
          const control = new FCCFormGroup({});
          this.masterState.addControl(section, control);
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeProductModel(modelJson: any, master = false, stateType?: string) {
    // this.formModelService.getFormModel(productCode, eventTypeCode, subTnxTypeCode).subscribe(modelJson => {
    if (master) {
      this.productModelMaster = modelJson;
    }
    this.productModel = modelJson;
    // });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeEventModel(eventModel, stateType?: string) {
    // this.formModelService.getFormModelForEvent().subscribe(modelJson => {
    this.eventModel = eventModel;
    // });
  }

  isStateInitialized(master = false): boolean {
    if (master && this.masterState) {
      return true;
    }
    if (!master && this.stateData) {
      return true;
    }
    return false;
  }

  private getState(master = false, stateType?: string): FCCFormGroup {
    if (stateType === EnumMapping.stateTypeEnum.EVENTSTATE) {
      return this.eventState;
    } else if (stateType === EnumMapping.stateTypeEnum.AMENDSTATE) {
      return this.amendState;
    } else {
      if (master) {
        return this.masterState;
      }
      return this.stateData;
    }
  }

  private getSectionList(master = false, stateType?: string): string[] {
    const tnxTypeCode = this.commonServices.getQueryParametersFromKey(
      FccGlobalConstant.TNX_TYPE_CODE
    );
    const subTnxTypeCode = this.commonServices.getQueryParametersFromKey(
      FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE
    );
    if (stateType === EnumMapping.stateTypeEnum.EVENTSTATE) {
      return this.eventSectionList;
    } else if (stateType === EnumMapping.stateTypeEnum.AMENDSTATE) {
      return this.amendSectionList;
    } else {
      if (
        master &&
        ((tnxTypeCode && tnxTypeCode !== FccGlobalConstant.N002_AMEND) ||
          (tnxTypeCode &&
            tnxTypeCode === FccGlobalConstant.N002_AMEND &&
            subTnxTypeCode &&
            subTnxTypeCode === FccGlobalConstant.N003_AMEND_RELEASE))
      ) {
        return this.masterSectionList;
      }
      return this.sectionList;
    }
  }

  getProductModel(master = false): any {
    if (
      master &&
      this.commonServices.isNonEmptyValue(this.productModelMaster)
    ) {
      return this.productModelMaster;
    }
    return this.productModel;
  }

  getEventModel() {
    const eventJson = this.eventModel;
    return eventJson;
  }

  // Return a List of Section Names
  getSectionNames(master = false, stateType?: string): string[] {
    let listNames: string[] = [];
    const sectionNames: string[] = [];

    listNames = this.getSectionList(master, stateType);

    listNames.forEach((name) => {
      sectionNames.push(name);
    });

    return sectionNames;
  }

  private getSectionFormControl(
    sectionName: string,
    master = false
  ): FCCFormGroup {
    if (this.eventInqurySection.indexOf(sectionName) === -1) {
      this.commonServices.isEventModelSection = false;
      return this.formControlService.getFormControls(
        this.getProductModel(master)[sectionName],
        this.stateId
      );
    } else {
      this.commonServices.isEventModelSection = true;
      return this.formControlService.getFormControls(
        this.eventModel[sectionName],
        this.stateId
      );
    }
  }

  // Set the Section Form to Parent State
  setStateSection(
    sectionName: string,
    form: FCCFormGroup,
    master = false,
    stateType?: string
  ) {
    if (
      this.getSectionList(master, stateType).indexOf(sectionName) > -1 &&
      form &&
      form.controls
    ) {
      this.getState(master, stateType).controls[sectionName] = form;
      this.getState(master, stateType).updateValueAndValidity();
    }
  }

  // Returns Section Form
  // If ProductCode is provided (which can be any string for now). It will Set the Section Form to Parent State
  getSectionData(
    sectionName: string,
    productCode?: string,
    master = false,
    stateType?: string
  ): FCCFormGroup {
    let sectionForm: FCCFormGroup;
    if (this.getState(master, stateType)) {
      if (
        this.getSectionList(master, stateType).indexOf(sectionName) > -1 &&
        this.isStateSectionSet(sectionName, master, stateType)
      ) {
        sectionForm = this.getState(master, stateType).controls[
          sectionName
        ] as FCCFormGroup;
      } else {
        sectionForm = this.getSectionFormControl(sectionName, master);
      }
      if (productCode) {
        this.setStateSection(sectionName, sectionForm, master, stateType);
      }
    }
    return sectionForm;
  }

  // Checks if the Section Form is present in Parent State
  isStateSectionSet(
    sectionName: string,
    master = false,
    stateType?: string
  ): boolean {
    try {
      if (
        this.getState(master, stateType) &&
        Object.keys(
          this.getState(master, stateType).controls[sectionName][
            FccGlobalConstant.CONTROLS
          ]
        ).length === 0
      ) {
        return false;
      }
      return true;
    } catch (error) {}
  }

  // Return FCCFormControl
  getControl(
    sectionName: string,
    controlName: string,
    master = false,
    stateType?: any
  ): FCCFormControl {
    return this.getState(master, stateType).controls[sectionName][
      FccGlobalConstant.CONTROLS
    ][controlName] as FCCFormControl;
  }

  // Return FCCFormControl
  getSubControl(
    sectionName: string,
    controlName: string,
    subControlName: string,
    master = false,
    stateType?: any
  ): FCCFormControl {
    if (this.getState(master, stateType).controls[sectionName] !== undefined) {
      return this.getState(master, stateType).controls[sectionName][
        FccGlobalConstant.CONTROLS
      ][controlName][FccGlobalConstant.CONTROLS][
        subControlName
      ] as FCCFormControl;
    }
  }

  // Return FCCFormControl
  getNestedToNestedControl(
    sectionName: string,
    controlName: string,
    subControlName: string,
    nestedControlName: string,
    master = false
  ): FCCFormControl {
    return this.getState(master).controls[sectionName][
      FccGlobalConstant.CONTROLS
    ][controlName][FccGlobalConstant.CONTROLS][subControlName][
      FccGlobalConstant.CONTROLS
    ][nestedControlName] as FCCFormControl;
  }

  // Returns the Value Object. For Different Controls it can vary.
  getValueObject(
    sectionName: string,
    controlName: string,
    master = false
  ): any {
    return this.getState(master).controls[sectionName][
      FccGlobalConstant.CONTROLS
    ][controlName].value;
  }

  // Returns the Value Object. For Nested Controls it can vary.
  getNestedToNestedValueObject(
    sectionName: string,
    subControlName: string,
    nestedControlName: string,
    nestedToNestedControlName: string,
    master = false
  ): any {
    return this.getState(master).controls[sectionName][
      FccGlobalConstant.CONTROLS
    ][subControlName][FccGlobalConstant.CONTROLS][nestedControlName][
      FccGlobalConstant.CONTROLS
    ][nestedToNestedControlName].value;
  }

  // Returns Localized String Value
  getValue(sectionName: string, controlName: string, master = false): string {
    return this.preiewService.getValue(
      this.getState(master).controls[sectionName][FccGlobalConstant.CONTROLS][
        controlName
      ],
      true
    );
  }

  getSubControlValue(
    sectionName: string,
    subControlName: string,
    controlName: string,
    master = false
  ): string {
    return this.preiewService.getValue(
      this.getState(master).controls[sectionName][FccGlobalConstant.CONTROLS][
        subControlName
      ].get(controlName),
      true
    );
  }

  getTabValue(controlName: any): string {
    return this.preiewService.getValue(controlName, true);
  }

  // Returns Non-Localized String Value
  getNonLocalizedValue(
    sectionName: string,
    controlName: string,
    master = false
  ): string {
    return this.preiewService.getPreviousValue(
      this.getState(master).controls[sectionName][FccGlobalConstant.CONTROLS][
        controlName
      ]
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNonLocalizedTabValue(controlName: any, master = false): string {
    return this.preiewService.getPreviousValue(controlName);
  }
  getBankNonLocalizedTabValue(
    sectionName: string,
    controlName: string,
    master = false
  ): string {
    let value;
    if (
      this.getState(master).controls[sectionName] &&
      this.getState(master).controls[sectionName][
        FccGlobalConstant.CONTROLS
      ] !== undefined
    ) {
      const subSectionForm = this.getState(master).controls[
        sectionName
      ] as FCCFormGroup;
      Object.keys(subSectionForm.controls).forEach((element) => {
        const innerSectionForm = subSectionForm.controls[
          element
        ] as FCCFormGroup;
        if (innerSectionForm.controls !== undefined) {
          Object.keys(innerSectionForm.controls).forEach((data) => {
            if (
              innerSectionForm.get(data)[FccGlobalConstant.KEY] === controlName
            ) {
              value = this.preiewService.getPreviousValue(
                innerSectionForm.get(data)
              );
            }
          });
        }
      });
      return value;
    }
  }

  // Sets the Value Object. For Different Controls it can Value param should be handled accordingly
  setValue(
    sectionName: string,
    controlName: string,
    value: any,
    master = false
  ) {
    this.getState(master).controls[sectionName][FccGlobalConstant.CONTROLS][
      controlName
    ].patchValue(value);
    this.getState(master).controls[sectionName][FccGlobalConstant.CONTROLS][
      controlName
    ].updateValueAndValidity();
  }

  // Checks if the Section Form is present in Parent State and is Valid.
  isSectionFormValid(sectionName: string, master = false): boolean {
    if (this.isStateSectionSet(sectionName, master)) {
      return this.getSectionData(sectionName, undefined, master).valid;
    }
    return false;
  }

  // Clears the Parent State
  clearState(master = false, stateType?: string) {
    if (stateType && stateType === EnumMapping.stateTypeEnum.EVENTSTATE) {
      this.eventSectionList = [];
      this.eventState = new FCCFormGroup({});
    } else if (stateType && stateType === EnumMapping.stateTypeEnum.AMENDSTATE) {
      this.amendState = new FCCFormGroup({});
      this.amendSectionList = [];
    } else {
      if (master) {
        this.masterSectionList = [];
        this.masterState = new FCCFormGroup({});
      } else {
        this.sectionList = [];
        this.masterSectionList = [];
        this.stateData = new FCCFormGroup({});
      }
    }
  }
  // Populate the Section in the Parent Form.
  populateEmptySectionInState(
    sectionName: string,
    productCode?: string,
    master = false,
    stateType?: string
  ) {
    this.setStateSection(
      sectionName,
      this.getSectionData(sectionName, productCode, master, stateType),
      master,
      stateType
    );
  }

  updateAllSectionsDataInState(productCode?: string, master = false, stateType?: string) {
    this.getSectionList(master, stateType).forEach((sectionName) => {
      this.setStateSection(
        sectionName,
        this.getSectionData(sectionName, productCode, master, stateType),
        master,
        stateType
      );
    });
  }

  // Populate all the Sections in the Parent Form.
  populateAllEmptySectionsInState(
    productCode?: string,
    master = false,
    stateType?: string
  ) {
    this.getSectionList(master, stateType).forEach((sectionName) => {
      this.populateEmptySectionInState(
        sectionName,
        productCode,
        master,
        stateType
      );
    });
  }

  // Returns Parent State Value which is all the formcontrol values in Key:Value pair
  parentStateValue(master = false): any {
    if (master) {
      return this.masterState.value;
    }
    return this.stateData.value;
  }

  // Checks if the parent State is valid.
  isParentStateValid(master = false): boolean {
    if (master) {
      return this.masterState.valid;
    }
    return this.stateData.valid;
  }

  validateStateFields(): boolean {
    let isValid = true;
    this.sectionList.forEach((section) => {
      if (!this.validateAllFormFields(this.getSectionData(section))) {
        isValid = false;
      }
    });
    return isValid;
  }

  protected validateAllFormFields(formGroup: FCCFormGroup): boolean {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FCCFormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    return formGroup.valid;
  }

  // extend if there is need for different master screenname like two different products?
  private setScreenName(master = false) {
    const screen = "screen";
    if (this.getProductModel(master)) {
      this.screenName = this.getProductModel(master)[screen];
    } else {
      this.screenName = this.getProductModel()[screen];
    }
  }

  getScreenName(): string {
    return this.screenName;
  }

  checkApplicableSections(
    section,
    option,
    subTnxType,
    mode,
    tnxTypeCode,
    Id?: any,
    parent = false
  ): boolean {
    let addSection = false;
    const operation = this.commonServices.getQueryParametersFromKey(
      FccGlobalConstant.OPERATION
    );
    const productCode = this.commonServices.getQueryParametersFromKey(
      FccGlobalConstant.PRODUCT
    );

    let tnxStatCode;
    let eventTab;
    let transactionTab;
    let tnxsubTnxType;
    let isMaster;

    const transactionDetail =
      this.transactionDetailsMap.getSingleTransaction(Id);

    if (transactionDetail && transactionDetail !== "") {
      tnxStatCode = transactionDetail.tnxStatCode;
      eventTab = transactionDetail.eventTab;
      transactionTab = transactionDetail.transactionTab;
      tnxTypeCode = transactionDetail.tnxTypeCode;
      tnxsubTnxType = transactionDetail.subTnxType;
      isMaster = transactionDetail.isMaster;
    }

    const applicableSections = section[FccGlobalConstant.APPLICABLE_SECTIONS];

    if (applicableSections) {
      if (
        operation !== undefined &&
        operation === FccGlobalConstant.LIST_INQUIRY
      ) {
        for (const applicableSection of applicableSections) {
          const applicabletnxTypeCode =
            applicableSection[FccGlobalConstant.TRANSACTION_TYPE_CODE];
          const applicableOption = applicableSection[FccGlobalConstant.OPTION];
          const applicableProductCode =
            applicableSection[FccGlobalConstant.PRODUCT];
          const applicableSubTnxTypeCode =
            applicableSection[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE];
          const applicableMaster =
            applicableSection[FccGlobalConstant.IS_MASTER];
          const applicabletnxStatusCode =
            applicableSection[FccGlobalConstant.TRANSACTION_STAT_CODE];
          const combination = applicableSection[FccGlobalConstant.COMBINATION];
          const applicableSwiftVersion =
            applicableSection[FccGlobalConstant.SWIFT_VERSION];
          const applicableShowTemplate =
            applicableSection[FccGlobalConstant.SHOW_TEMPLATE];
          if (applicableProductCode === productCode) {
            if (!isMaster) {
              if (
                tnxStatCode &&
                applicabletnxStatusCode &&
                applicabletnxStatusCode.indexOf(tnxStatCode) !== -1
              ) {
                addSection = true;
              } else if (
                tnxTypeCode &&
                applicabletnxTypeCode &&
                applicabletnxTypeCode.indexOf(tnxTypeCode) !== -1
              ) {
                addSection = true;
              } else if (
                tnxsubTnxType &&
                applicableSubTnxTypeCode &&
                applicableSubTnxTypeCode.indexOf(tnxsubTnxType) !== -1
              ) {
                addSection = true;
              }

              if (!addSection && combination) {
                for (const value of combination) {
                  const subType =
                    value[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE];
                  const tnxStat =
                    value[FccGlobalConstant.TRANSACTION_STAT_CODE];
                  const type = value[FccGlobalConstant.COMBINATION_TYPE];
                  const tnxType = value[FccGlobalConstant.TNX_TYPE_CODE];
                  let subTypeValue = false;
                  let tnxStatValue = false;
                  let tnxTypeValue = false;
                  if (tnxsubTnxType && subType && tnxsubTnxType === subType) {
                    subTypeValue = true;
                  }
                  if (
                    tnxStatCode &&
                    tnxStat &&
                    tnxStatCode === tnxStat &&
                    eventTab
                  ) {
                    tnxStatValue = true;
                  }
                  if (tnxTypeCode && tnxType && tnxTypeCode === tnxType) {
                    tnxTypeValue = true;
                  }
                  if (
                    subTypeValue &&
                    tnxStatValue &&
                    type === FccGlobalConstant.SUB_TNX_TYPE_TNX_STAT
                  ) {
                    addSection = true;
                  }
                  if (
                    tnxTypeValue &&
                    tnxStatValue &&
                    type === FccGlobalConstant.TNX_TYPE_TNX_STAT
                  ) {
                    addSection = true;
                  }
                }
              }
            }

            if (isMaster) {
              if (
                applicableMaster &&
                isMaster === applicableMaster &&
                transactionTab
              ) {
                addSection = true;
              }
            }
            if (
              applicableSwiftVersion &&
              applicableSwiftVersion !== null &&
              applicableSwiftVersion !== ""
            ) {
              addSection = this.checkSwiftComplianceForSection(
                applicableSwiftVersion
              );
            }
            if (
              applicabletnxTypeCode &&
              applicabletnxTypeCode === tnxTypeCode &&
              applicableOption &&
              applicableOption === option &&
              applicableShowTemplate !== undefined &&
              !applicableShowTemplate
            ) {
              addSection = false;
            }
          }
        }
      } else {
        for (const applicableSection of applicableSections) {
          const applicableSubTnxType =
            applicableSection[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE];
          const applicableTnxType =
            applicableSection[FccGlobalConstant.TRANSACTION_TYPE_CODE];
          const applicableOption = applicableSection[FccGlobalConstant.OPTION];
          const applicableMode = applicableSection[FccGlobalConstant.MODE];
          const applicableSwiftVersion =
            applicableSection[FccGlobalConstant.SWIFT_VERSION];
          const applicableParent = applicableSection[FccGlobalConstant.PARENT];
          const applicableProductCode =
            applicableSection[FccGlobalConstant.PRODUCT];
          const applicableShowTemplate =
            applicableSection[FccGlobalConstant.SHOW_TEMPLATE];
          const applicableMaster =
            applicableSection[FccGlobalConstant.IS_MASTER];
          const applicabletnxStatusCode =
            applicableSection[FccGlobalConstant.TRANSACTION_STAT_CODE];

          /**
           * If EVENT state, i.e. loading sections from Event Details model.json, check for product code condition and then
           * other attributes.
           * If not event state, i.e. Initiate screen or other view sections loading from respective product form model,
           * by default isProductValid should be set to true. So we dont have to specify product code in the product form models,
           * under applicableSections.
           */
          let isProductValid = true;
          if (
            this.eventSectionList.indexOf(section) === -1 &&
            applicableProductCode !== undefined &&
            applicableProductCode === productCode
          ) {
            isProductValid = true;
          } else if (
            this.eventSectionList.indexOf(section) === -1 &&
            applicableProductCode !== undefined &&
            applicableProductCode !== productCode
          ) {
            isProductValid = false;
          }
          if (isProductValid) {
            if (
              (applicableSubTnxType && applicableSubTnxType === subTnxType) ||
              (applicableOption && applicableOption === option) ||
              (applicableMode && applicableMode === mode) ||
              (applicableTnxType &&
                applicableTnxType === tnxTypeCode &&
                !option) ||
              (subTnxType &&
                applicableSubTnxType &&
                applicableSubTnxType.indexOf(subTnxType) !== -1) ||
              (tnxTypeCode &&
                applicableTnxType &&
                applicableTnxType.indexOf(tnxTypeCode) !== -1 &&
                !option) ||
              (isMaster && applicableMaster && isMaster === applicableMaster) ||
              (applicableTnxType && applicableTnxType === tnxTypeCode)
            ) {
              addSection = true;
            }
            if (
              tnxStatCode &&
              applicabletnxStatusCode &&
              applicabletnxStatusCode.indexOf(tnxStatCode) !== -1
            ) {
              addSection = true;
            }
            if (
              applicableSwiftVersion &&
              applicableSwiftVersion !== null &&
              applicableSwiftVersion !== ""
            ) {
              addSection = this.checkSwiftComplianceForSection(
                applicableSwiftVersion
              );
            }
            if (applicableParent && parent) {
              addSection = true;
            }
            if (
              applicableTnxType &&
              applicableTnxType === tnxTypeCode &&
              applicableOption &&
              applicableOption === option &&
              applicableShowTemplate !== undefined &&
              !applicableShowTemplate
            ) {
              addSection = false;
            }
          }
        }
      }
    } else {
      addSection = true;
    }
    return addSection;
  }

  checkSwiftComplianceForSection(swiftVersion: any) {
    let isValid = true;
    this.commonServices.getSwiftVersionValue();
    if (this.commonServices.swiftVersion !== swiftVersion) {
      isValid = false;
    }
    if (swiftVersion && this.commonServices.swiftVersion >= swiftVersion) {
      isValid = true;
    }
    return isValid;
  }

  addEventDetailsControlToStateData(modelJson) {
    Object.keys(modelJson).forEach((section) => {
      if (
        this.sectionList.indexOf(section) === -1 &&
        typeof modelJson[section] === "object" &&
        section === FccGlobalConstant.eventDetails
      ) {
        this.sectionList.push(section);
        const control = new FCCFormGroup({});
        this.stateData.addControl(section, control);
      }
    });
  }

  /**
   * add a dynamic section to state data called from leftsectionservice#addDynamicSection
   *
   * @param section - section key defined in formmodel
   * @param index - optional, position at which section to be added. default- order as defined in formmodel
   */
  addDynamicSectionToStateData(section: string, index?: number) {
    if (this.sectionList.indexOf(section) === -1) {
      const idx = index !== undefined ? index : this.getSectionIndex(section);
      const control = new FCCFormGroup({});
      this.stateData.addControl(section, control);
      this.onlineHelpMap.set(section, this.getProductModel()[section].helpId);
      this.sectionList.splice(
        idx - FccGlobalConstant.LENGTH_1,
        FccGlobalConstant.LENGTH_0,
        section
      );
    }
  }

  /**
   * add a dynamic section to state data called from leftsectionservice#addDynamicSection
   *
   * @param section - section key defined in formmodel
   */
  removeDynamicSectionToStateData(section: string) {
    this.sectionList.splice(
      this.sectionList.indexOf(section),
      FccGlobalConstant.LENGTH_1
    );
    this.stateData.removeControl(section);
    this.onlineHelpMap.delete(section);
  }

  getSectionIndex(section: string) {
    const modelJson = this.getProductModel();
    const allSections = [];
    Object.keys(modelJson).forEach((modelSection) => {
      if (typeof modelJson[modelSection] === "object") {
        allSections.push(modelSection);
      }
    });
    return allSections.indexOf(section);
  }

  setAutoSaveCreateFlagInState(autoSaveCreateFlag: boolean) {
    this.autoSaveCreateFlag = autoSaveCreateFlag;
  }

  getAutoSaveCreateFlagInState() {
    return this.autoSaveCreateFlag;
  }

  setAutoSaveConfig(autoSaveEnabledFlag: boolean, autoSaveDelay?: any) {
    this.autoSaveConfig = {
      isAutoSaveEnabled: autoSaveEnabledFlag,
      autoSaveDelay: autoSaveDelay
    };
  }

  getAutoSaveConfig() {
    return this.autoSaveConfig;
  }

  setAutoSavedTime(autoSavedTimestamp?: any) {
    this.savedTimestamp = autoSavedTimestamp;
    this.commonServices.autoSavedTime.next(this.savedTimestamp);
  }

  getAutoSavedTime() {
    return this.savedTimestamp;
  }
}

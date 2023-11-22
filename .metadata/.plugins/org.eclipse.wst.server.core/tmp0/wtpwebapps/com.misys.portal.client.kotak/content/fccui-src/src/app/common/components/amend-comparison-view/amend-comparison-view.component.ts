import { Component, Input, OnInit } from '@angular/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FormModelService } from '../../services/form-model.service';
import { FCCFormControl, FCCFormGroup } from './../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { GroupClubService } from '../../../common/services/group-club.service';
import { TabPanelService } from '../../../common/services/tab-panel.service';
import { FormAccordionPanelService } from '../../../common/services/form-accordion-panel.service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { CommonService } from '../../services/common.service';
import { PreviewService } from '../../../corporate/trade/lc/initiation/services/preview.service';
import { CountryList } from '../../../common/model/countryList';
import { SpacerControl } from './../../../base/model/form-controls.model';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { Router } from '@angular/router';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';



interface ValueDetails {
  value?: string;
  type?: string;
  label?: string;
  masterRender?: boolean;
  transactionRender?: boolean;
  clubbedHeader?: string;
  masterValue?: string;
  translateValue?: string;
  valStyleClass?: string;
  amendedLabel?: string;
  amendedFlag?: boolean;
  fullWidthView?: boolean;
  labelStyleClass?: string;
  labelOnly?: boolean;
  invalidValue?: boolean;
  clubbedInvalidField?: boolean;
  valueOnly?: boolean;
}

@Component({
  selector: 'fcc-amend-comparison-view',
  templateUrl: './amend-comparison-view.component.html',
  styleUrls: ['./amend-comparison-view.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: AmendComparisonViewComponent }]

})
export class AmendComparisonViewComponent extends FCCBase implements OnInit {

  @Input() productCode;
  @Input() masterTransactionHeader;
  @Input() TransactionHeader;
  formModelJson: any;
  form: FCCFormGroup;
  module: any;
  mode: any;
  master: boolean;
  isMasterRequired: any;
  key = 'key';
  globalDashboardUrl: any;
  transaction1HeaderKey = 'transaction1Header';
  transaction2HeaderKey = 'transaction2Header';
  productItemsMapForComparison: Map<string, string[]>;
  summaryDetailsMap: Map<string, Map<string, ValueDetails>>; // Map<SectionName, Map<FieldName, Value>>
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;
  tabSectionMasterControlMap: Map<string, Map<string, FCCFormControl>>;
  accordionPanelControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;
  accordionPanelMasterControlMap: Map<string, Map<string, FCCFormControl>>;
  groupItemsMap: Map<string, Map<string, string[]>>; // contains Map<fieldName, Map<GroupHeader, [GroupChildern]>>
  clubbeItemsMap: Map<string, Map<string, string[]>>; // contains Map<FieldName, clubbedHeader, [clubbedList]>
  clubbedDetailsMap: Map<string, Map<string, ValueDetails>>; // Map<SectionName, Map<FieldName, Value>>
  licenseMap: Map<string, Map<string, FCCFormControl>>;
  hideGrpHeaderList: string[]; // List of group headers to be hidden.
  dynamicCriteriaMap: Map<string, string>;
  clubbedTrueFields: string[] = [];
  clubbedChildList: string[] = [];
  sectionNames: string[];
  operation: any;
  tnxTypeCode: any;
  subTnxType: any;
  obj = {};
  layoutValue = 'p-col-12 p-md-12 p-lg-12 p-sm-12 padding_zero';
  licenseLayoutValue = 'p-col-6 license';
  OnlyAmendedFieldsSwitch = 'onlyAmendedFieldsSwitch';
  isLicenseAmended = false;
  notEntered: any = '';
  readonly id = 'id';
  readonly params = 'params';
  readonly grouphead = 'grouphead';
  readonly previewCriteria = 'previewCriteria';
  readonly previewScreen = 'previewScreen';
  readonly rendered = 'rendered';
  readonly groupChildren = 'groupChildren';
  readonly hideGrpHeaderInView = 'hideGrpHeaderInView';
  readonly options = 'options';
  readonly valueStr = 'value';
  readonly label = 'label';
  readonly spacer = 'spacer';
  readonly columns = 'columns';
  readonly fullWidth = FccGlobalConstant.FULL_WIDTH_VIEW;
  readonly labelOnly = FccGlobalConstant.LABEL_ONLY;
  readonly valueOnly = FccGlobalConstant.VALUE_ONLY;
  readonly nameStr = 'name';
  readonly typeStr = 'type';
  readonly layoutClassStr = 'layoutClass';
  readonly styleClassStr = 'styleClass';
  readonly parentStyleClassStr = 'parentStyleClass';
  readonly NOLOCALIZATIONSTR = 'nolocalization';
  readonly defaultValue = 'defaultValue';
  readonly clubbedDelimiter = 'clubbedDelimiter';
  readonly clubbedList = 'clubbedList';
  readonly clubbedHeaderText = 'clubbedHeaderText';
  readonly feildType = 'feildType';
  readonly presentSection = 'presentSection';
  readonly dependSection = 'dependSection';
  readonly dependControl = 'dependControl';
  readonly requiredValue = 'requiredValue';
  readonly requiredValues = 'requiredValues';
  readonly swiftVersion = 'swiftVersion';
  readonly notRequiredValue = 'notRequiredValue';
  readonly dependendCondition = 'dependendCondition';
  readonly parentCondition = 'parentCondition';
  readonly viceversaCheck = 'viceversaCheck';
  readonly renderCheck = 'renderCheck';
  readonly tnxTypecode = 'tnxTypeCode';
  readonly hideIfEmpty = 'hideIfEmpty';
  readonly isSubsectionModel = 'isSubsectionModel';
  readonly hideFields = 'hideFields';
  readonly prefix = 'prefix';
  readonly inputTable = 'input-table';
  readonly noDelete = 'noDelete';
  readonly inputEditTable = 'edit-table';
  readonly hasActions = 'hasActions';
  readonly noEdit = 'noEdit';
  readonly linkedLicenses = 'linkedLicenses';
  readonly License = 'license';
  showLicenseSection: boolean;

  readonly listOfLicenseSections: string[] = ['licenseDetails', 'elLicenseDetails', 'icLicenseDetails',
  'tfLicenseDetails', 'ftTradeLicenseDetails', 'ecLicenseDetails', 'uiLicenseDetails', 'uaLicenseDetails'];



  constructor(protected formModelService: FormModelService, protected translateService: TranslateService,
              protected groupClubService: GroupClubService, protected tabPanelService: TabPanelService,
              protected formAccordionPanelService: FormAccordionPanelService,
              protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected utilityService: UtilityService,
              protected commonService: CommonService, protected previewService: PreviewService, ) {
    super();
  }

  ngOnInit(): void {
    this.module = '';
    this.initProductModelAndStateForComparison();
  }

  public initProductModelAndStateForComparison() {
    this.formModelService.getFormSubsectionAndEventModel(this.productCode)
      .subscribe(modelJson => {
        this.formModelJson = modelJson[0];
        this.isMasterRequired = this.isMasterRequired;
        this.operation = this.commonService.getQueryParametersFromKey (FccGlobalConstant.OPERATION);
        this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
        this.subTnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
        this.sectionNames = this.stateService.getSectionNames(false);
        this.tabSectionControlMap = new Map<string, Map<string, FCCFormControl>>();
        this.tabSectionMasterControlMap = new Map<string, Map<string, FCCFormControl>>();
        this.accordionPanelControlMap = new Map<string, Map<string, FCCFormControl>>();
        this.accordionPanelMasterControlMap = new Map<string, Map<string, FCCFormControl>>();
        this.notEntered = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
        //to hide a toggle that appears randomly as this service is called randomly somewhere else
        if(!this.commonService.hideamendtoggle){
          this.setProductItemsMapForComparison();
        }
        this.commonService.loadDefaultConfiguration().subscribe(response => {
          if (response) {
              this.showLicenseSection = response.showLicenseSection;
          }
        });

        this.setProductItemsMapForComparison();
      },
        // no permission or config, redirect to global dashboard
        () => {
          if (!this.commonService.getEnableUxAddOn()) {
            const dontShowRouter = 'dontShowRouter';
            let homeDojoUrl = '';
            if (!this.commonService.getEnableUxAddOn() && window[dontShowRouter] && window[dontShowRouter] === true) {
              homeDojoUrl = this.fccGlobalConstantService.contextPath;
              homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
              homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
              window.open(homeDojoUrl, '_self');
            }
          } else {
            this.commonService.getDashboardUrl();
            this.router.navigate([this.commonService.globalDashboardUrl]);
          }
        });
  }

  public setProductItemsMapForComparison() {
    this.productItemsMapForComparison = new Map();
    this.groupClubService.initializeMaps(this.formModelJson);
    this.initGroupService();
    this.addSection(this.formModelJson);
    this.initSummary();
  }

  addSection(modelJson) {
    Object.keys(modelJson).forEach(section => {
      const isEnabledByConfiguration = this.checkSectionConfiguration(this.form, section);
      if (typeof modelJson[section] === 'object') {
        if (isEnabledByConfiguration) {
          this.addSectionNameToProductItems(section, modelJson);
        }
      }
      });
  }

  addSectionNameToProductItems(section, modelJson) {
    this.productItemsMapForComparison.set(section, []);
    if (this.tabPanelService.isTabPanel(modelJson[section])) {
      this.setTabControls(section);
    } else if (this.formAccordionPanelService.isFormAccordionPanel(modelJson[section], undefined, undefined)) {
      this.setFormAccordionControls(section);
    }
    else if (modelJson[section][this.id]) {
      const controls = this.formControlService.getFormControls(modelJson[section]).controls;
      Object.keys(controls).forEach(control => {
        const presentControl = controls[control] as FCCFormControl;
        if (presentControl && (!presentControl[this.params].isNotRequiredForComparison))
        {
            const terms = `${this.translateService.instant( 'LIST_N003_03')}`;
            if (!((presentControl[this.params].isRequiredForAmendComparison) &&
                (this.masterTransactionHeader && (this.masterTransactionHeader.includes(terms)))) )
                {
                  this.checkDynamicControl(control, true);
                }
            if (!((presentControl[this.params].isRequiredForAmendComparison) &&
                (this.TransactionHeader && (this.TransactionHeader.includes(terms)))) )
                {
                  this.checkDynamicControl(control, false);
                }
            const fieldName = controls[control][this.key];
            const isGroupField = controls[control][this.params][this.grouphead];
            let previewScreen: boolean;
            const previewCriteria = controls[control][this.params][this.previewCriteria];
            if ( previewCriteria && previewCriteria !== undefined && previewCriteria instanceof Object) {
            previewScreen = controls[control][this.params][this.previewScreen];
          } else {
            previewScreen = controls[control][this.params][this.previewScreen];
            previewScreen = previewScreen === false ? false : true;
          }

            if (fieldName && !isGroupField && previewScreen) {
            this.setLicenseMap(fieldName, presentControl);
            this.productItemsMapForComparison.get(section).push(fieldName);
          }
        }
      });
    }
  }

  setTabControls(sectionName: string) {
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, true));
    this.tabSectionMasterControlMap.set(sectionName, this.tabPanelService.getShallowTabSectionControlMap().get(sectionName));
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, false));
    this.tabSectionControlMap.set(sectionName, this.tabPanelService.getShallowTabSectionControlMap().get(sectionName));
    if (this.tabSectionControlMap.has(sectionName)) {
      for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
        this.checkDynamicControl(fieldName, true);
        this.checkDynamicControl(fieldName, false);
        const isGroupField = control[this.params][this.grouphead];
        let previewScreen = control[this.params][this.previewScreen];
        previewScreen = previewScreen === false ? false : true;
        if (fieldName && !isGroupField && previewScreen) {
          if (this.productItemsMapForComparison.get(sectionName).indexOf(fieldName) === -1) {
            this.productItemsMapForComparison.get(sectionName).push(fieldName);
          }
        }
      }
    }
  }

  protected initGroupService() {
    this.groupItemsMap = this.groupClubService.getSubGroupMap();
    this.clubbeItemsMap = this.groupClubService.getClubbedFieldMap();
    this.clubbedTrueFields = this.groupClubService.getClubbedTrueFields();
    this.dynamicCriteriaMap = this.groupClubService.getDynamicCretiraFields();
    this.hideGrpHeaderList = this.groupClubService.getHideGrpHeaderList();
  }

  protected initSummary() {
    this.initializeSummaryDetailsMap();
    this.initializeFormGroup();
  }

  initializeSummaryDetailsMap() {
    this.summaryDetailsMap = new Map();
    this.clubbedDetailsMap = new Map();

    this.sectionNames.forEach(sectionName => {
      if (this.tabPanelService.getTabSectionList().indexOf(sectionName) !== -1 && this.tabSectionControlMap.has(sectionName)
          && this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1) {
        const controls: any[] = [];
        const masterControls: any[] = [];
        for (const [control] of this.tabSectionControlMap.get(sectionName)) {
          controls.push(control);
        }
        for (const [control] of this.tabSectionMasterControlMap.get(sectionName)) {
          masterControls.push(control);
        }
        this.iterateMapControl(sectionName, controls, masterControls);
      } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) !== -1 &&
      this.accordionPanelControlMap.has(sectionName)) {
        let controls: any[] = [];
        let masterControls: any[] = [];
        controls = this.getControlsforAccordionData(sectionName, false);
        masterControls = this.getControlsforAccordionData(sectionName, true);
        this.iterateMapControl(sectionName, controls, masterControls);
      } else {
        if (this.stateService.isStateSectionSet(sectionName)) {
          const sectionForm: FCCFormGroup = this.stateService.getSectionData(sectionName, undefined, false);
          const masterSectionForm: FCCFormGroup = this.stateService.getSectionData(sectionName, undefined, true);
          if (sectionForm) {
            this.iterateMapControl(sectionName, sectionForm.controls, masterSectionForm.controls);
          }
        }
      }
    });
  }

  initializeFormGroup(){
    this.form = new FCCFormGroup({});
    this.addAmendOnlySwitch();
    this.addHeaders();
    this.dateHeaderField();
    for (const [key, value] of this.productItemsMapForComparison) {
      if (this.sectionNames.indexOf(key) > -1){
        if (this.summaryDetailsMap.has(key) && this.summaryDetailsMap.get(key)) {
          this.setSectionControl(key, value);
        }
      }

    }
  }

  setSectionControl(sectionName: string, fieldNames: string[]) {
    const sectionHeaderObj = this.jsonObject(sectionName, 'text', FccGlobalConstant.P_COL_6, ['summarySection']);
    let changedSectionName = FccGlobalConstant.MASTER_STATE + sectionName;
    // Adding master Section Header in text control
    this.form.addControl(changedSectionName, this.formControlService.getControl(sectionHeaderObj));
    if (this.checkifSectionHeaderIsRequiredForViewOnlyAmendedFields(sectionName, changedSectionName))
    {
      this.patchFieldParameters(this.form.get(changedSectionName), { amendedFlag: true });
    }
    if (fieldNames && fieldNames.includes(this.linkedLicenses) && this.isLicenseAmended)
    {
      this.patchFieldParameters(this.form.get(changedSectionName), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    }
    changedSectionName = FccGlobalConstant.TRANSACTION_STATE + sectionName;
     // Adding transaction Section Header in text control
    this.form.addControl(changedSectionName, this.formControlService.getControl(sectionHeaderObj));
    if (this.checkifSectionHeaderIsRequiredForViewOnlyAmendedFields(sectionName, changedSectionName))
    {
      this.patchFieldParameters(this.form.get(changedSectionName), { amendedFlag: true });
    }
    fieldNames.forEach(fieldName => {
      if (this.groupItemsMap && this.groupItemsMap.has(fieldName) && !this.isGroupEmpty(sectionName, fieldName)) { // checks for Group
        this.setGroupClubControls(sectionName, fieldName);
      }
      else if (this.licenseMap.has(fieldName))
      {
        this.placingLicenseFields(fieldName, FccGlobalConstant.MASTER_STATE);
        this.placingLicenseFields(fieldName, FccGlobalConstant.TRANSACTION_STATE);
      }
      else
      {
        this.placingFields(sectionName, fieldName);
      }
    });

  }

  setGroupClubControls(sectionName: string, fieldName: string) {
    // iterating the group head
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      // Adding GroupHead in text control
      const groupHeadObj = this.jsonObject(groupHeader, 'text', FccGlobalConstant.P_COL_6, ['form-header subheader-title']);
      let changedgroupHeader = FccGlobalConstant.MASTER_STATE + groupHeader;
      if (!this.checkifGroupHeadIsNotRequired(sectionName, fieldName, true))
      {
        this.form.addControl(changedgroupHeader, this.formControlService.getControl(groupHeadObj));
        if (this.checkIfRequiredForViewOnlyAmendedFields(sectionName, fieldName))
        {
          this.patchFieldParameters(this.form.get(changedgroupHeader), { amendedFlag: true });
        }
      }
      else
      {
        this.form.addControl(sectionName + this.spacer + fieldName,
          new SpacerControl(this.translateService, { layoutClass: 'p-col-6', rendered: true }));
      }
      changedgroupHeader = FccGlobalConstant.TRANSACTION_STATE + groupHeader;
      if (!this.checkifGroupHeadIsNotRequired(sectionName, fieldName, false))
      {
        this.form.addControl(changedgroupHeader, this.formControlService.getControl(groupHeadObj));
        if (this.checkIfRequiredForViewOnlyAmendedFields(sectionName, fieldName))
        {
          this.patchFieldParameters(this.form.get(changedgroupHeader), { amendedFlag: true });
        }
      }
      else
      {
        this.form.addControl(sectionName + this.spacer + fieldName,
          new SpacerControl(this.translateService, { layoutClass: 'p-col-6', rendered: true }));
      }
      groupChildren.forEach(groupChild => {
         this.iterateGroupClubControl(sectionName, groupChild);
      });
    }
  }

  checkifSectionHeaderIsRequiredForViewOnlyAmendedFields(sectionName: string, changedSectionName?: string)
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [fieldName, valueDetails] of this.summaryDetailsMap.get(sectionName)) {
        if (valueDetails.amendedLabel) {
            return true;
          }
        }
    const fieldNames = Array.from(this.summaryDetailsMap.get(sectionName).keys());
    if (fieldNames && fieldNames.includes(this.License) && this.isLicenseAmended)
        {
          this.patchFieldParameters(this.form.get(changedSectionName), { amendedFlag: true });
        }
    return false;
  }

  iterateGroupClubControl(sectionName: string, groupChild: string) {
    // Handling Clubbing
    if (this.clubbedTrueFields.indexOf(groupChild) === -1 || (groupChild === FccGlobalConstant.CURRENCY)) {
      if (this.summaryDetailsMap.get(sectionName).has(groupChild))
      {
        this.setFieldControl(groupChild, null, sectionName, true);
        this.setFieldControl(groupChild, null, sectionName, false);
      }
    }
  }

  isLicenseSections(sectionName): boolean {
    return this.listOfLicenseSections.indexOf(sectionName) !== -1;
  }

  checkSectionConfiguration(form: FCCFormGroup, section) {
      let isEnabled = true;
      if (this.isLicenseSections(section) && !this.showLicenseSection) {
        isEnabled = false;
      }
      return isEnabled;
  }

  isGroupEmpty(sectionName: string, fieldName: string): boolean {
    let isEmpty = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      groupChildren.forEach(groupChild => {
        if (this.summaryDetailsMap.get(sectionName).has(groupChild)) {
          isEmpty = false;
        }
      });
    }
    return isEmpty;
  }

  checkifGroupHeadIsNotRequired(sectionName: string, fieldName: string, master: boolean)
  {
    let isEmpty = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      groupChildren.forEach(groupChild => {
        if (this.summaryDetailsMap.get(sectionName).has(groupChild)) {
          if (master)
          {
             if (this.summaryDetailsMap.get(sectionName).get(groupChild).masterRender)
             {
              isEmpty = false;
             }
          }
          else {
            if (this.summaryDetailsMap.get(sectionName).get(groupChild).transactionRender)
             {
              isEmpty = false;
             }
          }
        }
      });
    }
    return isEmpty;
  }

  checkIfRequiredForViewOnlyAmendedFields(sectionName: string, fieldName: string)
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      groupChildren.forEach(groupChild => {
        if (this.summaryDetailsMap.get(sectionName).has(groupChild)) {
          if (this.summaryDetailsMap.get(sectionName).get(groupChild).amendedLabel)
          {
            return true;
          }
        }
      });
    }
    return false;
  }

  jsonObject(name: string, type: string, layoutClass?: string, styleClass?: any, parentStyleClass?: any,
             localization?: any, value?: any, defaultValue?: any): any {
     this.obj = {};
     this.obj[this.nameStr] = name;
     this.obj[this.typeStr] = type;
     this.obj[this.valueStr] = value;
     this.obj[this.layoutClassStr] = layoutClass;
     this.obj[this.styleClassStr] = styleClass;
     this.obj[this.parentStyleClassStr] = parentStyleClass;
     this.obj[this.NOLOCALIZATIONSTR] = localization;
     this.obj[this.defaultValue] = defaultValue;
     return this.obj;
  }

  placingFields(sectionName: string, fieldName: string){
    if (this.summaryDetailsMap.get(sectionName).has(fieldName))
    {
      this.setFieldControl(fieldName, null, sectionName, true);
      this.setFieldControl(fieldName, null, sectionName, false);
    }
  }

  setFieldControl(fieldName: string, layoutClass?: string, sectionName?: any, master?: boolean) {
    const keyFieldName = fieldName;
    if (this.clubbeItemsMap.has(fieldName))
    {
      fieldName = this.translateService.instant(this.clubbeItemsMap.get(fieldName).keys().next().value);
    }
    else
    {
      fieldName = `${this.translateService.instant(fieldName)}`;
    }
    const layoutClassVar = layoutClass ? layoutClass : FccGlobalConstant.P_COL_6;
    let type = FccGlobalConstant.AMEND_COMPARISON_CONTROL;
    let fieldvalue = '';
    let changedFieldName = FccGlobalConstant.TRANSACTION_STATE + keyFieldName;
    let masterRender = true;
    let tnxRender = true;
    if (this.summaryDetailsMap.get(sectionName).has(keyFieldName))
    {
      tnxRender = this.summaryDetailsMap.get(sectionName).get(keyFieldName).transactionRender;
    }
    const amendmentInfoLabel = this.getamendInfoLabelForComparioson(sectionName, keyFieldName);
    if (master)
    {
      changedFieldName = FccGlobalConstant.MASTER_STATE + keyFieldName;
      if (this.dynamicCriteriaMap !== undefined && this.dynamicCriteriaMap.has(keyFieldName)) {
        if (this.summaryDetailsMap.get(sectionName).has(keyFieldName))
        {
          masterRender = this.summaryDetailsMap.get(sectionName).get(keyFieldName).masterRender;
        }
      }
      if (!masterRender && tnxRender)
      {
        type = this.spacer;
      }
    }
    else
    {
      if (masterRender && !tnxRender)
      {
        type = this.spacer;
      }
    }
    if (type !== this.spacer)
    {
      fieldvalue = this.getFieldValue(sectionName, keyFieldName, master);
      if (master)
      {
        const transactionFieldValue = this.getFieldValue(sectionName, keyFieldName, false);
        if (fieldvalue === this.notEntered && transactionFieldValue !== this.notEntered)
        {
          fieldvalue = `${this.translateService.instant(FccGlobalConstant.DELETED)}`;
        }
      }
      const fieldObj = this.jsonObject(fieldName, type, layoutClassVar, ['summaryVal'], ['summaryField'], null, fieldvalue);
      this.form.addControl(changedFieldName, this.formControlService.getControl(fieldObj));
    }
    else
    {
      this.form.addControl(sectionName + this.spacer + fieldName ,
        new SpacerControl(this.translateService, { layoutClass: 'p-col-6', rendered: true }));
    }
    if (master && amendmentInfoLabel && (type !== this.spacer))
    {
      this.patchFieldParameters(this.form.get(changedFieldName),
      { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    }
    if (amendmentInfoLabel)
    {
      this.patchFieldParameters(this.form.get(changedFieldName), { amendedFlag: true });
    }
    this.patchFieldParameters(this.form.get(changedFieldName),
    { origSectionName: sectionName, origFieldName: keyFieldName });

  }

  getamendInfoLabelForComparioson(sectionName: string, fieldName: string)
  {
      if (this.summaryDetailsMap.get(sectionName).get(fieldName) &&
      (this.summaryDetailsMap.get(sectionName).get(fieldName).amendedLabel))
      {
        return this.summaryDetailsMap.get(sectionName).get(fieldName).amendedLabel;
      }
      else if (this.clubbedDetailsMap.has(sectionName) && this.clubbedDetailsMap.get(sectionName).get(fieldName)
      && this.clubbedDetailsMap.get(sectionName).get(fieldName).amendedLabel)
      {
        return this.clubbedDetailsMap.get(sectionName).get(fieldName).amendedLabel;
      }
      else {
         return null;
      }
  }

  getFieldValue(sectionName: string, fieldName: string, ismaster: boolean)
  {
    let fieldvalue = '';
    if (this.clubbedDetailsMap.has(sectionName) && this.clubbedDetailsMap.get(sectionName).get(fieldName))
    {
      if (ismaster)
      {
       fieldvalue = this.clubbedDetailsMap.get(sectionName).get(fieldName).masterValue;
      }
      else{
       fieldvalue = this.clubbedDetailsMap.get(sectionName).get(fieldName).value;
      }
    }
    else
    {
      if (this.summaryDetailsMap.get(sectionName).has(fieldName) )
      {
         if (ismaster)
         {
          fieldvalue = this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue;
         }
         else{
          fieldvalue = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
         }
      }
    }
    if (!fieldvalue)
    {
      fieldvalue = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    }
    return fieldvalue;
  }

  iterateMapControl(sectionName: string, fieldsControl, masterFieldsControl) {
    if (fieldsControl && this.productItemsMapForComparison.has(sectionName)) {
      this.productItemsMapForComparison.get(sectionName).forEach(fieldName => {
        const control = this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl);
        if (control) {
          const children = control[this.params][this.groupChildren] as [];
          const isGroupHeader = (children !== undefined && children.length > 0) ? true : false;
          let previewScreen = control[this.params][this.previewScreen];
          previewScreen = previewScreen === false ? false : true;
          const isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
            this.mode === FccGlobalConstant.EXISTING;
            /**
             * Check for previewScreen condition only in case of preview stepper screen.
             * Since before adding all fields, rendered and preview screen check is done later.
             */
          if (control && ((isPreview && previewScreen) || !isPreview)) {
            if (!this.summaryDetailsMap.has(sectionName)) {
              this.summaryDetailsMap.set(sectionName, new Map());
              this.clubbedDetailsMap.set(sectionName, new Map());
            }
            if (isGroupHeader) {
              let hideGrpHeaderInView = control[this.params][this.hideGrpHeaderInView];
              hideGrpHeaderInView = hideGrpHeaderInView === true ? true : false;
              // Hide the Header in preview/view
              if (!hideGrpHeaderInView) {
                this.populateSummaryDetailsMap(sectionName, fieldName, fieldsControl, masterFieldsControl);
              }
            } else {
              this.populateSummaryDetailsMap(sectionName, fieldName, fieldsControl, masterFieldsControl);
            }
            if (this.licenseMap.has(fieldName)) {
              this.setLicenseMapWithStateData(fieldName,
                 this.getConntrolFromfieldsControl(sectionName, fieldName, masterFieldsControl), FccGlobalConstant.MASTER_STATE);
              this.setLicenseMapWithStateData(fieldName,
                  this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl), FccGlobalConstant.TRANSACTION_STATE);
            }
            if (this.clubbeItemsMap && this.clubbeItemsMap.has(fieldName)) {
              this.populateClubbedDetailsMap(sectionName, fieldName, fieldsControl, masterFieldsControl);
            }
            if (control[this.params][this.groupChildren]) {
              this.iterateGroupChildrenMapControl(sectionName, fieldName, fieldsControl, masterFieldsControl);
            }
          }
        }
      });
    }
  }

  getConntrolFromfieldsControl(sectionName: string, fieldName: string, fieldsControl, master?: boolean): FCCFormControl {
    let control;
    if (this.tabPanelService.getTabSectionList().indexOf(sectionName) !== -1
      && this.tabSectionControlMap.get(sectionName).has(fieldName)) {
        if (master)
        {
          control = this.tabSectionMasterControlMap.get(sectionName).get(fieldName);
        }
        else
        {
          control = this.tabSectionControlMap.get(sectionName).get(fieldName);
        }
    } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) > -1) {
      this.initializeAccordionPanelMap(sectionName);
      if (master)
        { if (this.accordionPanelMasterControlMap.get(sectionName).has(fieldName)) {
          control = this.accordionPanelMasterControlMap.get(sectionName).get(fieldName);
 }
        }
        else
        { if (this.accordionPanelControlMap.get(sectionName).has(fieldName)) {
          control = this.accordionPanelControlMap.get(sectionName).get(fieldName);
 }
        }
    } else {
      control = fieldsControl[fieldName];
    }
    return control;
  }

  iterateGroupChildrenMapControl(sectionName: string, fieldName: string, fieldsControl, masterFieldsControl) {
    if (this.groupItemsMap && this.groupItemsMap.get(fieldName) !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
        groupChildren.forEach(groupChild => {
          if (this.clubbeItemsMap.has(groupChild)) {
            this.populateClubbedDetailsMap(sectionName, groupChild, fieldsControl, masterFieldsControl);
          }
          this.populateSummaryDetailsMap(sectionName, groupChild, fieldsControl, masterFieldsControl);
        });
      }
    }
  }

  populateSummaryDetailsMap(sectionName: string, field: string, fieldsControl, masterFieldsControl) {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);
    const masterControl = this.getConntrolFromfieldsControl(sectionName, field, masterFieldsControl, true);
    this.handleShipmentMutualFields(control);
    this.handleShipmentMutualFields(masterControl);
    if (control && control[this.params] && control[this.params][FccGlobalConstant.PDF_DISPLAY_HIDDEN_VALUE]
      && (this.tnxTypeCode === FccGlobalConstant.N002_AMEND)) {
        control[this.params][this.rendered] = false;
      }
    if (((control && control[this.params][this.rendered]) ||
        (control && control[this.params][FccGlobalConstant.VIEW_DISPLAY]))
        || ((masterControl && masterControl[this.params][this.rendered]) ||
        (masterControl && masterControl[this.params][FccGlobalConstant.VIEW_DISPLAY]))) {
      this.setFieldsToSections(control, sectionName, masterControl);
    }

    if (field === this.linkedLicenses && ((control && control.params.infolabel) ||
     (masterControl && masterControl.params.infolabel)))
    {
       const emptyLicenses = '{"license":[]}';
       if (!((control.value === emptyLicenses && this.commonService.isEmptyValue(masterControl.value) ) ||
        (masterControl.value === emptyLicenses && this.commonService.isEmptyValue(control.value))))
        {
          if (!(masterControl.value === control.value))
          {
            this.isLicenseAmended = true;
          }
        }
    }
  }

  protected handleShipmentMutualFields(control: FCCFormControl) {
    if (control && control[this.params] && control[this.params][FccGlobalConstant.DISPLAY_PREVIEW] &&
      (control.value === '' || control.value === null || control.value === undefined)) {
      control[this.params][this.rendered] = false;
    }
  }

  setFieldsToSections(control, sectionName, masterControl) {
    const fieldName = control.key;
    const typeVal = control.type;
    const translate = control.params[FccGlobalConstant.TRANSLATE];
    let masterRender = true;
    let tnxRender = true;
    let translateVal = '';
    let masterVal = this.previewService.getValue(masterControl, true);
    if (masterVal === 'Y' || masterVal === 'N')
    {
      masterVal = masterVal.toLowerCase() === 'y' ? `${this.translateService.instant('yes')}`
      : `${this.translateService.instant('no')}`;
    }
    if (control.type === FccGlobalConstant.inputTextArea) {
        this.commonService.decodeNarrative = false;
      }
    let val = this.previewService.getValue(control, true);
    let amendedLabel = null;
    let amendedFlag = false;
    if (control.params.infolabel || control.params.groupLabel || masterControl.params.infolabel || masterControl.params.groupLabel) {
      amendedLabel = control.params.infolabel ? control.params.infolabel : control.params.groupLabel;
      amendedFlag = true;
    }
    if (typeVal === 'checkbox' || typeVal === FccGlobalConstant.inputSwitch) {
      if (translate && val !== '') {
        translateVal = control.params[FccGlobalConstant.TRANSLATE_VALUE];
        val = this.translateService.instant( translateVal + val);
      } else {
        val = (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes') ? `${this.translateService.instant('yes')}`
        : `${this.translateService.instant('no')}`;
      }
    } else if (translate && control.params[FccGlobalConstant.TRANSLATE] === true && val !== '') {
      translateVal = control.params[FccGlobalConstant.TRANSLATE_VALUE];
      val = this.translateService.instant( translateVal + val);
    } else if (typeVal === FccGlobalConstant.inputDropdown && control[this.options]) {
      Object.keys(control[this.options]).forEach(dropDownobj => {
        if (control[this.options][dropDownobj][this.valueStr] === val) {
          val = control[this.options][dropDownobj][this.label];
        }
      });
    } else if (typeVal === FccGlobalConstant.selectButton && control[this.options] && val === '') {
        const tempVal = this.translateService.instant( control.key + '_' + val);
        if (tempVal !== (control.key + '_')) {
          val = tempVal;
        }
    }

    if (control.params[FccGlobalConstant.PREVIEW_DISPALYED_VALUE]) {
      val = (control.params[FccGlobalConstant.DISPLAYED_VALUE] !== '' && control.params[FccGlobalConstant.DISPLAYED_VALUE] !== undefined)
      ? control.params[FccGlobalConstant.DISPLAYED_VALUE] : val;
    }

    let labelVal = control.params[this.label];
    if (this.commonService.isViewPopup && labelVal === FccGlobalConstant.EMPTY_STRING && this.subTnxType &&
          this.subTnxType === FccGlobalConstant.N003_AMEND_RELEASE) {
      labelVal = control.params[this.key];
    }
    if (this.dynamicCriteriaMap !== undefined && this.dynamicCriteriaMap.has(fieldName)) {
      masterRender = masterControl[this.params][this.rendered];
      tnxRender = control[this.params][this.rendered];
    }
    if ((typeVal !== this.spacer || typeVal !== 'button-div')) {
      const valueDetails: ValueDetails = {
        type: typeVal,
        value: val,
        label: labelVal,
        masterValue: masterVal,
        translateValue: translateVal,
        amendedLabel,
        amendedFlag,
        masterRender,
        transactionRender: tnxRender,
        fullWidthView: control[this.params][this.fullWidth],
        labelOnly: control[this.params][this.labelOnly],
        valueOnly: control[this.params][this.valueOnly]
      };
      this.commonService.decodeNarrative = true;
      this.summaryDetailsMap.get(sectionName).set(fieldName, valueDetails);
    }
  }

  getClubbedValueIterator(sectionName: string, childField, fieldsControl, val, clubbedDelimiter, master = false): string {
    const childControl = this.getConntrolFromfieldsControl(sectionName, childField.toString(), fieldsControl, master);
    let value = '';
    const spaceVal = ' ';
    if (childControl && childControl[this.params][this.rendered] && childControl[this.params][this.previewScreen]) {
      if (childControl.type === 'checkbox') {
        value = this.previewService.getCheckBoxLabelValue(childControl);
      } else {
        value = this.previewService.getValue(childControl, true);
      }
    }
    const keyArray = [
      "applicantcountry",
      "loanEntitycountry",
      "beneficiarycountry",
      "beneficiaryTypecountry",
      "addressLinecountry",
      "draweecountry",
      "altApplicantcountry",
    ];
    const delimitter = '-';
    if (childControl && keyArray.indexOf(childControl.key) > -1)
    {
      let countryList: CountryList;
      this.commonService.getCountries().subscribe(data => {
        countryList = data;
        const exist = countryList.countries.filter(task => task.alpha2code === fieldsControl[childField].value);
        if (exist !== null && exist.length > 0) {
        const country = countryList.countries.filter(task => task.alpha2code === fieldsControl[childField].value.shortName)[0];
        if (country) {
          value = country.alpha2code + delimitter + country.name;
        }
      }
      });
    }

    if (childControl && childControl.params[FccGlobalConstant.TRANSLATE] && value !== '') {
      const translateVal = childControl.params[FccGlobalConstant.TRANSLATE_VALUE];
      value = `${this.translateService.instant( translateVal + value)}`;
    }

    if (value && value.trim() && value.length > 0) {
      val += value + clubbedDelimiter + spaceVal;
    }
    return val;
  }

  getClubbedValue(sectionName: string, field: string, fieldsControl, master = false): string {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl, master);
    let clubbedDelimiter = ' ';
    if (control && control[this.params][this.clubbedDelimiter]) {
      clubbedDelimiter = control[this.params][this.clubbedDelimiter];
    }
    let val = '';
    if (control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      Object.keys(clubbedList).forEach(childField => {
        val = this.getClubbedValueIterator(sectionName, clubbedList[childField], fieldsControl, val, clubbedDelimiter, master);
        if (fieldsControl[childField] && (fieldsControl[childField][this.params])
        && !(fieldsControl[childField][this.params][this.rendered]) &&
        this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1)
        {
          this.clubbedChildList.push(childField);
        } else if (fieldsControl[clubbedList[childField]] && (fieldsControl[clubbedList[childField]][this.params])
        && !(fieldsControl[clubbedList[childField]][this.params][this.rendered]) &&
        this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1)
        {
          this.clubbedChildList.push(childField);
        } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) > -1
        && this.accordionPanelControlMap.get(sectionName).has(field)) {
          const childControl = this.getConntrolFromfieldsControl(sectionName, clubbedList[childField], fieldsControl);
          if (!(childControl[this.params][this.rendered])) {
            this.clubbedChildList.push(childField);
          }
        }
      });
    }
    if (val.length > 0) {
      val = val.substring(0, val.length - FccGlobalConstant.LENGTH_2);
    }
    return val;
  }

  populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl, masterFieldsControl) {
    this.clubbedChildList.splice(0, this.clubbedChildList.length);
    if (control) {
    const fieldName = control.key;
    const val = this.getClubbedValue(sectionName, field, fieldsControl);
    let masterVal = '';
    masterVal = this.getClubbedValue(sectionName, field, masterFieldsControl, true);
    const typeVal = control.type;
    const labelVal = control.params[this.label];
    const clubbedHeaderVal = control.params[this.clubbedHeaderText];
    let infoLabel = null;
    if (control.params.infolabel || control.params.groupLabel) {
      infoLabel = control.params.infolabel ? control.params.infolabel : control.params.groupLabel;
    }
    if (control.params && control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      clubbedList.forEach(childField => {
        if (fieldsControl[childField] && (fieldsControl[childField].params.infolabel || fieldsControl[childField].params.groupLabel)
            && childField !== 'applicantcountry') {
          infoLabel = true;
        }
      });
    }

    const valueDetails: ValueDetails = {
      type: typeVal,
      value: val,
      label: labelVal,
      clubbedHeader: clubbedHeaderVal,
      masterValue: masterVal,
      amendedLabel: infoLabel
    };

    if (control && control.params && control.params[this.clubbedList] && control[this.params][this.feildType]
      && control[this.params][this.feildType] === 'amount' ) {
        const clubbedList = control.params[this.clubbedList];
        if (clubbedList.length !== this.clubbedChildList.length) {
          this.clubbedDetailsMap.get(sectionName).set(fieldName, valueDetails);
        }
    } else if (val !== '' || masterVal !== '') {
      this.clubbedDetailsMap.get(sectionName).set(fieldName, valueDetails);
    }
  }
  }

  populateClubbedDetailsMap(sectionName: string, field: string, fieldsControl, masterFieldsControl) {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);
    this.populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl, masterFieldsControl) ;
  }

  checkDynamicControl(control, master: boolean) {
    if (this.dynamicCriteriaMap !== undefined && this.dynamicCriteriaMap.has(control)) {
      this.checkDynamicCriteria(control, master);
    }
  }

  checkDynamicCriteria(checkControl, master: boolean) {
    const dependentObject = this.dynamicCriteriaMap.get(checkControl);
    const controlName = checkControl;

    if (dependentObject[this.renderCheck] === undefined &&
      this.stateService.isStateSectionSet(dependentObject[this.presentSection], master) &&
      this.stateService.isStateSectionSet(dependentObject[this.dependSection], master)) {
    // eslint-disable-next-line max-len
    const presentSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.presentSection], undefined, master);
    // eslint-disable-next-line max-len
    const dependSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.dependSection], undefined, master);

    if (presentSectionForm && presentSectionForm.controls) {
      const presentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.presentSection],
                                              controlName, presentSectionForm.controls, master);
      const dependentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.dependSection],
            dependentObject[this.dependControl], dependSectionForm.controls, master);
      // For reducing cognitive complexity
      if (presentcontrol) {
      this.checkForDependentFields(dependentObject, presentcontrol, dependentcontrol);
      }
    }
    }

    if (dependentObject[this.renderCheck] !== undefined &&
    this.stateService.isStateSectionSet(dependentObject[this.presentSection], master)) {
      const presentSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.presentSection],
        undefined, master);
      const dependSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.dependSection],
        undefined, master);
      const presentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.presentSection],
          controlName, presentSectionForm.controls);
      const dependentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.dependSection],
            dependentObject[this.dependControl], dependSectionForm.controls);
      if (true) { // eslint-disable-line no-constant-condition
// eslint-disable-next-line max-len
    if (presentSectionForm && presentSectionForm.controls) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
      }
      }
      if ((dependentObject[this.requiredValue] || dependentObject[this.requiredValues] || dependentObject[this.notRequiredValue]
        || dependentObject[this.viceversaCheck]) && presentcontrol) {
        this.checkForDependentFields(dependentObject, presentcontrol, dependentcontrol);
      }
    }
  }

  checkSectionDynamicCriteria(form: FCCFormGroup) {
    if (form && form.dynamicRenderCriteria){
      const dependantControlName = form.dynamicRenderCriteria[FccGlobalConstant.DC_DEPENDANT_CONTROL];
      const dependantSectionName = form.dynamicRenderCriteria[FccGlobalConstant.DC_DEPENDANT_SECTION];
      const dependantSectionForm: FCCFormGroup =
      this.stateService.getSectionData(dependantSectionName);
      const dependentcontrol =
      this.getConntrolFromfieldsControl(dependantSectionName, dependantControlName, dependantSectionForm.controls);
      const dependentcontrolValue = this.formControlService.getFieldControlValue(dependentcontrol);
      if (form.dynamicRenderCriteria[this.requiredValues] && form.dynamicRenderCriteria[this.requiredValues] instanceof Array) {
          if (form.dynamicRenderCriteria[this.requiredValues].indexOf(dependentcontrolValue) === -1) {
            form[this.rendered] = false;
            form.updateValueAndValidity();
            return false;
          }
    } else if (form.dynamicRenderCriteria[this.requiredValue] &&
       form.dynamicRenderCriteria[this.requiredValue] !== dependentcontrolValue) {
        form[this.rendered] = false;
        form.updateValueAndValidity();
        return false;
    } else if (form.dynamicRenderCriteria[this.hideIfEmpty] && !(this.commonService.isNonEmptyValue(dependentcontrolValue)
    && dependentcontrolValue !== '')) {
        form[this.rendered] = false;
        return false;
    }
      form[this.rendered] = true;
      form.updateValueAndValidity();
}
    return true;
}

  checkForDependentFields(dependentObject, presentcontrol, dependentcontrol) {
    let isHiddenField: boolean;
    const controlName = presentcontrol[this.key];
    const val1 = (presentcontrol && this.commonService.isNonEmptyValue(presentcontrol.value)) ? presentcontrol.value : null;
    const val2 = (dependentcontrol && this.commonService.isNonEmptyValue(dependentcontrol.value)) ? dependentcontrol.value : null;
    if (dependentObject[this.requiredValue]) {
          isHiddenField = this.isHiddenField(dependentObject, controlName);
          if ((val2 && val2 === dependentObject[this.requiredValue] && !isHiddenField) && !(val2 instanceof Array)) {
            presentcontrol[this.params][this.rendered] = true;
          } else if ((val2 && val2 instanceof Array) && val2[0].value === dependentObject[this.requiredValue] && !isHiddenField) {
            presentcontrol[this.params][this.rendered] = true;
          } else {
            presentcontrol[this.params][this.rendered] = false;
          }
          presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.viceversaCheck] && dependentcontrol) {
      isHiddenField = this.isHiddenField(dependentObject, controlName);
      if (val1 !== undefined && val1 !== '' && val1 !== null && !isHiddenField) {
        dependentcontrol[this.params][this.rendered] = false;
      } else {
        dependentcontrol[this.params][this.rendered] = true;
      }
      dependentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.requiredValues] && dependentObject[this.requiredValues] instanceof Array) {
      isHiddenField = this.isHiddenField(dependentObject, controlName);
      for (const value of dependentObject[this.requiredValues]) {
        if (val2 && value === val2 && !isHiddenField) {
          presentcontrol[this.params][this.rendered] = true;
          presentcontrol.updateValueAndValidity();
          break;
        } else {
          presentcontrol[this.params][this.rendered] = false;
          presentcontrol.updateValueAndValidity();
        }
      }
    } else if (dependentObject[this.notRequiredValue]) {
      if (val2 && val2 === dependentObject[this.notRequiredValue] && !(val2 instanceof Array)) {
        presentcontrol[this.params][this.rendered] = false;
      } else if ((val2 && val2 instanceof Array) && val2[0].value === dependentObject[this.notRequiredValue]) {
        presentcontrol[this.params][this.rendered] = false;
      } else if (dependentObject[this.swiftVersion]) {
        this.commonService.getSwiftVersionValue();
        if (this.commonService.swiftVersion !== dependentObject[this.swiftVersion] && presentcontrol) {
          presentcontrol[this.params][this.rendered] = false;
        } else {
          presentcontrol[this.params][this.rendered] = true;
        }
      } else {
        presentcontrol[this.params][this.rendered] = true;
      }
      presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.hideIfEmpty]) {
      if ((dependentObject[this.hideIfEmpty]) === true) {
        if (val2 !== undefined && val2 !== '' && val2 !== null) {
            presentcontrol[this.params][this.rendered] = true;
        } else {
            presentcontrol[this.params][this.rendered] = false;
        }
    } else if ((dependentObject[this.hideIfEmpty]) === false) {
        presentcontrol[this.params][this.rendered] = true;
      }
    } else if (dependentObject[this.dependendCondition]) {
      presentcontrol[this.params][this.rendered] = true;
      presentcontrol.updateValueAndValidity();
    } else if (presentcontrol.value === null && presentcontrol.value === undefined &&
      presentcontrol.value === FccGlobalConstant.EMPTY_STRING &&
      dependentObject[this.dependendCondition] !== undefined && !dependentObject[this.dependendCondition]) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.swiftVersion]) {
        this.commonService.getSwiftVersionValue();
        if (this.commonService.swiftVersion === dependentObject[this.swiftVersion] && presentcontrol) {
          presentcontrol[this.params][this.rendered] = true;
        } else {
          presentcontrol[this.params][this.rendered] = false;
        }
        presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.parentCondition] && this.commonService.parent) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
    }
  }

  isHiddenField(dependentObject, controlName) {
    if (dependentObject[this.isSubsectionModel] && dependentObject[this.isSubsectionModel] === 'Y' && dependentObject[this.hideFields]) {
      const hiddenFields = dependentObject[this.hideFields];
      const prefix = dependentObject[this.prefix];
      const subSectionFieldsList = this.getSubSectionFields(hiddenFields, prefix);
      if (subSectionFieldsList.indexOf(controlName.toLowerCase()) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
   }
  }

  getSubSectionFields(hiddenFields, prefix) {
    const subSectionFieldsList: string[] = [];
    Object.keys(hiddenFields).forEach(fieldName => {
        const nameOfField = this.groupClubService.getProperFieldName(prefix, hiddenFields[fieldName]);
        subSectionFieldsList.push(nameOfField.toLowerCase());
      });
    return subSectionFieldsList;
  }

  addAmendOnlySwitch() {
    const amendOnlySwitch = this.jsonObject(this.OnlyAmendedFieldsSwitch,
      FccGlobalConstant.inputSwitch, this.layoutValue, ['only-amended-fields'], null, null, null, FccGlobalConstant.CODE_N);
    this.form.addControl(this.OnlyAmendedFieldsSwitch, this.formControlService.getControl(amendOnlySwitch));
  }

  addHeaders()
  {
    const transaction1HeaderText = this.jsonObject(this.masterTransactionHeader,
      FccGlobalConstant.TEXT, FccGlobalConstant.P_COL_6, ['transaction-header']);
    this.form.addControl(this.transaction1HeaderKey, this.formControlService.getControl(transaction1HeaderText));
    this.patchFieldParameters(this.form.get(this.transaction1HeaderKey), { amendedFlag: true });
    const transaction2HeaderText = this.jsonObject(this.TransactionHeader,
      FccGlobalConstant.TEXT, FccGlobalConstant.P_COL_6, ['transaction-header']);
    this.form.addControl(this.transaction2HeaderKey, this.formControlService.getControl(transaction2HeaderText));
    this.patchFieldParameters(this.form.get(this.transaction2HeaderKey), { amendedFlag: true });
  }

  dateHeaderField(){
    const fieldObj = this.jsonObject(this.translateService.instant('dateFollows') + ' ' +
    this.utilityService.getDisplayDateFormat(), FccGlobalConstant.TEXT, FccGlobalConstant.P_COL_6, ['dateStyleComparison']);
    this.form.addControl('MasterDateHeader', this.formControlService.getControl(fieldObj));
    this.form.addControl('TransactionDateHeader', this.formControlService.getControl(fieldObj));
    this.patchFieldParameters(this.form.get('MasterDateHeader'), { amendedFlag: true });
    this.patchFieldParameters(this.form.get('TransactionDateHeader'), { amendedFlag: true });
  }

  onClickOnlyAmendedFieldsSwitch(){
     const toggleValue = this.form.get(this.OnlyAmendedFieldsSwitch).value;
     if (toggleValue === FccGlobalConstant.CODE_Y)
     {
       this.onlyamendToggleValue = true;
     }
     else
     {
      this.onlyamendToggleValue = false;
     }
  }

  setLicenseMap(fieldName: string, control: FCCFormControl) {
    if (this.licenseMap === undefined) {
      this.licenseMap = new Map();
    }
    const licenseInnerMap = new Map<string, FCCFormControl>();
    if (control.type === this.inputEditTable) {
      licenseInnerMap.set(FccGlobalConstant.MASTER_STATE, control);
      licenseInnerMap.set(FccGlobalConstant.TRANSACTION_STATE, control);
      this.licenseMap.set(fieldName, licenseInnerMap);
    }
  }

  setLicenseMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl, state: string) {
    const fileUploadObj = this.jsonObject(fieldName, this.inputEditTable, this.licenseLayoutValue, ['license']);
    const shallowControl = this.formControlService.getControl(fileUploadObj);
    const shallowParams = Object.assign({}, fileUploadControl.params);
    shallowParams[this.hasActions] = true;
    shallowParams[this.noEdit] = true;
    shallowParams[this.layoutClassStr] = this.licenseLayoutValue;
    shallowControl[this.params] = shallowParams;
    this.licenseMap.get(fieldName).set(state, shallowControl as FCCFormControl);
}

placingLicenseFields(fieldName: string, state: string) {
  let flag;
  if (this.licenseMap.get(fieldName).get(state)[FccGlobalConstant.PARAMS].bankAttachmentPreview &&
      this.licenseMap.get(fieldName).get(state)[FccGlobalConstant.PARAMS].data.length === 0) {
    flag = false;
  } else {
    flag = true;
  }
  this.addLicenseFieldsControl(fieldName, flag, state);
}

addLicenseFieldsControl(fieldName: string, flag: boolean, state: string) {
  if (flag) {
    const changedfieldName = state + fieldName;
    const Licenses = this.licenseMap.get(fieldName).get(state);
    if (Licenses && Licenses[this.params])
    {
      const columns = Licenses[this.params].columns;
      if (columns.length === 0)
      {
        const val = `${this.translateService.instant(FccGlobalConstant.NO_LICENSE)}`;
        const fieldObj = this.jsonObject(val, FccGlobalConstant.TEXT, FccGlobalConstant.P_COL_6, ['summaryField'], undefined, true);
        this.form.addControl(changedfieldName, this.formControlService.getControl(fieldObj));
      }
      else
      {
        this.form.addControl(changedfieldName, Licenses);
      }
    }

    if (this.isLicenseAmended)
    {
      this.patchFieldParameters(this.form.get(changedfieldName), { amendedFlag: true });
    }
  }
}

setFormAccordionControls(sectionName: string) {
  const sectionForm = this.stateService.getSectionData(sectionName, undefined, false);
  this.initializeAccordionPanelMap(sectionName);
  if (this.accordionPanelControlMap.has(sectionName) && this.checkSectionDynamicCriteria(sectionForm)) {
    const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
    const accordionSubSectionsList = accordionSubSectionsListMap.get(sectionName);
    accordionSubSectionsList.forEach(subSection => {
    const subSectionForm = sectionForm.controls[subSection] as FCCFormGroup;
    if (this.checkSectionDynamicCriteria(subSectionForm))
    {
      Object.keys(subSectionForm.controls).forEach(fieldName => {
        const control = this.accordionPanelControlMap.get(sectionName).get(fieldName);
        const terms = `${this.translateService.instant( 'LIST_N003_03')}`;
        if (control !== undefined) {
          if (!((control[this.params].isRequiredForAmendComparison) &&
                (this.masterTransactionHeader && (this.masterTransactionHeader.includes(terms)))) )
              {
                this.checkDynamicControl(fieldName, true);
              }
          if (!((control[this.params].isRequiredForAmendComparison) &&
              (this.TransactionHeader && (this.TransactionHeader.includes(terms)))) )
              {
                this.checkDynamicControl(fieldName, false);
              }
          const isGroupField = control[this.params][this.grouphead];
          let previewScreen = control[this.params][this.previewScreen];
          let rendered = control[this.params][this.rendered];
          rendered = rendered === false ? false : true;
          previewScreen = previewScreen === false ? false : true;
          if (control.type === 'form-table') {
          previewScreen = rendered;
        }
          if (fieldName && !isGroupField && previewScreen ) {
          this.productItemsMapForComparison.get(sectionName).push(fieldName);
        }
    }
  });
    }
});
  }
}

initializeAccordionPanelMap(sectionName: string)
{
  this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
    this.stateService.getSectionData(sectionName, undefined, true));
  this.accordionPanelMasterControlMap = this.formAccordionPanelService.getShallowAccordionSectionControlMap();
  this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
    this.stateService.getSectionData(sectionName, undefined, false));
  this.accordionPanelControlMap = this.formAccordionPanelService.getShallowAccordionSectionControlMap();
}

getControlsforAccordionData(sectionName: string, master: boolean)
{
  const controls: any[] = [];
  const sectionForm = this.stateService.getSectionData(sectionName, undefined, master);
  this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
    this.stateService.getSectionData(sectionName, undefined, master));
  const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
  const accordionSubSectionAndControlsListMap = this.formAccordionPanelService.getAccordionSubSectionAndControlsListMap();
  const subSectionList = accordionSubSectionsListMap.get(sectionName);
  const subSectionControlsMap = accordionSubSectionAndControlsListMap.get(sectionName);
  subSectionList.forEach(subSection => {
    const subSectionForm = sectionForm.controls[subSection] as FCCFormGroup;
    if (subSectionForm[this.rendered] !== false) {
    const subSectionControls = subSectionControlsMap.get(subSection);
    controls.push(subSectionControls);
    }
  });
  return controls;
}

}


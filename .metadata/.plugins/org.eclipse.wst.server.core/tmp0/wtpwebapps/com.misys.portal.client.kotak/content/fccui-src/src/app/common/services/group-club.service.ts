import { FormAccordionPanelService } from './form-accordion-panel.service';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { FormModelService } from './form-model.service';
import { TabPanelService } from './tab-panel.service';
import { FCCFormControl } from './../../base/model/fcc-control.model';



@Injectable({
  providedIn: 'root'
})
export class GroupClubService {

  constructor(protected formModelService: FormModelService, protected tabPanelService: TabPanelService,
              protected commonServices: CommonService, protected formAccordionPanelService: FormAccordionPanelService) { }

  // properties
  readonly prefix = 'prefix';
  readonly amendClub = 'amendClub';
  readonly sectionType = 'sectionType';
  readonly groupChildren = 'groupChildren';
  readonly name = 'name';
  readonly clubbedHeaderText = 'clubbedHeaderText';
  readonly clubbedList = 'clubbedList';
  readonly subSectionGroup = 'subSectionGroup';
  readonly groupHeaderText = 'groupHeaderText';
  readonly dynamicCriteria = 'dynamicCriteria';
  readonly hideGrpHeaderInView = 'hideGrpHeaderInView';
  readonly key = 'key';

   formModel: any[] = [];
   eventModel: any; // TODO handle in better way

  // Map<FieldName, Map<GroupHeader, GroupChildrenNames>>
  private subGroupMap: Map<string, Map<string, string[]>>;
  // Map<FieldName, Map<ClubbedHeader, [ClubbedFieldsNames]>>
  private clubbedFieldMap: Map<string, Map<string, string[]>>;
  // List of clubbed fields which has Attaribute Clubbed = true
  private clubbedTrueFields: string[];
  // List of fields which has Attaribute amendClub = true
  private amendclubbedTrueFields: string[];
  // List of group headers to be hidden.
  private hideGrpHeaderList: string[];

  private dynamicCriteriaFields: Map<string, string>;
  readonly params = 'params';

  initializeMaps(modelJson: any , amendedValue :boolean = false) {
    this.initialize();
    this.initializeProductModel(modelJson, amendedValue);
    this.tabPanelService.initializeTabPanelService(modelJson);
    this.formAccordionPanelService.initializeAccordionPanelService(modelJson);
    this.setGroupClubSections();
    this.setGroupClubSectionsForTabs();
    this.setGroupClubSectionsForAccordians();
    this.setAmendClubFields();
  }

  initialize() {
    this.subGroupMap = new Map();
    this.clubbedFieldMap = new Map();
    this.clubbedTrueFields = [];
    this.amendclubbedTrueFields = [];
    this.dynamicCriteriaFields = new Map();
    this.hideGrpHeaderList = [];
    this.formModel = [];
  }

  setGroupClubSections() {
    for (let i = 0; i < this.formModel.length; i++) {
      if(this.formModel[i] !== undefined){
    const sectionNamesList = Object.keys(this.formModel[i]);
    sectionNamesList.forEach(sectionName => {
      const fieldsObj = this.formModel[i][sectionName];
      if (typeof fieldsObj === 'object') {
        Object.keys(fieldsObj).forEach(fieldName => {
          const field = fieldsObj[fieldName];
          if (field[this.prefix] && field[this.sectionType]) {
            const subSectionGroupList: string[] = [];
            let start = true;
            if (field[this.subSectionGroup]) {
              start = this.setsubSectionGroup(field, subSectionGroupList);
            }
            this.subSectionMapping(field[this.prefix], field[this.sectionType], subSectionGroupList, start, field);
          } else {
            this.setGroupField(field);
            this.setClubbedField(field);
            this.setDynamicField(field);
          }
        });
      }
    });
   }
  }
 }

iterateControls(subSectionControls: any) {
    subSectionControls.forEach(control => {
      const fieldName = control.key;
      const dynamicCriteriaFeild = control[this.params][this.dynamicCriteria];
      if (dynamicCriteriaFeild) {
        this.dynamicCriteriaFields.set(fieldName, dynamicCriteriaFeild );
      }
      if (control[this.prefix] && control[this.sectionType]) {
        let start = true;
        const subSectionGroupList: string[] = [];
        if (control[this.subSectionGroup]) {
          start = this.setsubSectionGroup(control, subSectionGroupList);
        }
        this.subSectionMapping(control[this.prefix], control[this.sectionType], subSectionGroupList, start, control);
        } else {
          this.setGroupAccordionField(control);
          this.setAccordionClubbedField(control);
        }
    });
}

  setDynamicField(field) {
    const fieldName = field[this.name];
    const dynamicCriteriaFeild = field[this.dynamicCriteria];
    if (dynamicCriteriaFeild) {
      this.dynamicCriteriaFields.set(fieldName, dynamicCriteriaFeild );
    }
  }

  setDynamicFieldsForSubsection(parentField, key) {
    if (parentField !== undefined) {
      const dynamicCriteriaField = parentField[this.dynamicCriteria];
      if (dynamicCriteriaField) {
          this.dynamicCriteriaFields.set(key, dynamicCriteriaField );
        }
      }
  }
  setTabbedDynamicField() {
    const sectionControls: Map<string, any[]> = this.tabPanelService.getsectionControlsMap();
    if (sectionControls !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [key, value] of sectionControls) {
        if (value) {
          value.forEach(field => {
            const fieldName = field[this.name];
            const dynamicCriteriaFeild = field[this.dynamicCriteria];
            if (dynamicCriteriaFeild) {
              this.dynamicCriteriaFields.set(fieldName, dynamicCriteriaFeild );
            }
          });
        }
      }
    }
  }

  setsubSectionGroup(field, subSectionGroupList): boolean {
    let start = true;
    const subSectionGroupListArray = field[this.subSectionGroup];
    Object.keys(subSectionGroupListArray).forEach(subGroupField => {
      subSectionGroupList.push(subSectionGroupListArray[subGroupField].toString());
    });
    if (subSectionGroupList.indexOf(this.prefix) === 0) {
      start = false;
    }
    return start;
  }

  setGroupClubSectionsForTabs() {
    const sectionControls: Map<string, any[]> = this.tabPanelService.getsectionControlsMap();
    if (sectionControls !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [key, value] of sectionControls) {
        if (value) {
          value.forEach(field => {
            if (field[this.prefix] && field[this.sectionType]) {
              let start = true;
              const subSectionGroupList: string[] = [];
              if (field[this.subSectionGroup]) {
                start = this.setsubSectionGroup(field, subSectionGroupList);
              }
              this.subSectionMapping(field[this.prefix], field[this.sectionType], subSectionGroupList, start, field);
            } else {
              this.setGroupField(field);
              this.setClubbedField(field);
              this.setDynamicField(field);
            }
          });
        }
      }
    }
  }

  private setGroupAccordionField(control) {
    const fieldName = control[this.key];
    const groupChildrenArray = control[this.params][this.groupChildren];
    if (groupChildrenArray) {
      const key = fieldName;
      const value: string[] = [];
      Object.keys(groupChildrenArray).forEach(childfieldName => {
        value.push(groupChildrenArray[childfieldName].toString());
      });
      // adding groupHeaderText
      const header = control[this.params][this.groupHeaderText] ?
        control[this.params][this.groupHeaderText] : key;
      const map: Map<string, string[]> = new Map();
      map.set(header, value);
      const hideHeader = control[this.params][this.hideGrpHeaderInView] === true ? true : false;
      if (hideHeader) {
        this.hideGrpHeaderList.push(header);
      }
      this.subGroupMap.set(key, map);
    }
  }

  private setAccordionClubbedField(control) {
    const fieldName = control[this.key];
    const clubbedListArray = control[this.params][this.clubbedList];
    if (clubbedListArray) {
      const key = control[this.params][this.clubbedHeaderText];
      const value: string[] = [];
      Object.keys(clubbedListArray).forEach(clubbedfieldName => {
        const clubbedName = clubbedListArray[clubbedfieldName].toString();
        if (clubbedListArray[clubbedfieldName] !== fieldName && this.clubbedTrueFields.indexOf(clubbedName) === -1) {
          this.clubbedTrueFields.push(clubbedName);
        }
        value.push(clubbedListArray[clubbedfieldName].toString());
      });
      const map: Map<string, string[]> = new Map();
      map.set(key, value);
      this.clubbedFieldMap.set(fieldName, map);
    }
  }

  private initializeProductModel(modelJson: any, amendedValue) {
    const operation = this.commonServices.getQueryParametersFromKey('operation');

    this.formModel.push(modelJson);

    if ((operation !== undefined && (operation === 'LIST_INQUIRY' || (operation === 'PREVIEW' && !amendedValue))) 
    || this.commonServices.parent ) {
        this.formModel.push(this.eventModel);
    }
  }

  private setGroupField(field) {
    const fieldName = field[this.name];
    const groupChildrenArray = field[this.groupChildren];
    if (groupChildrenArray) {
      const key = fieldName;
      const value: string[] = [];
      Object.keys(groupChildrenArray).forEach(childfieldName => {
        value.push(groupChildrenArray[childfieldName]?.toString());
      });
      // adding groupHeaderText
      const header = field[this.groupHeaderText] ? field[this.groupHeaderText] : key;
      const map: Map<string, string[]> = new Map();
      map.set(header, value);
      const hideHeader = field[this.hideGrpHeaderInView] === true ? true : false;
      if (hideHeader) {
        this.hideGrpHeaderList.push(header);
      }
      this.subGroupMap.set(key, map);
    }
  }

  private setClubbedField(field) {
    const fieldName = field[this.name];
    const clubbedListArray = field[this.clubbedList];
    if (clubbedListArray) {
      const key = field[this.clubbedHeaderText];
      const value: string[] = [];
      Object.keys(clubbedListArray).forEach(clubbedfieldName => {
        const clubbedName = clubbedListArray[clubbedfieldName].toString();
        if (clubbedListArray[clubbedfieldName] !== fieldName && this.clubbedTrueFields.indexOf(clubbedName) === -1) {
          this.clubbedTrueFields.push(clubbedName);
        }
        value.push(clubbedListArray[clubbedfieldName].toString());
      });
      const map: Map<string, string[]> = new Map();
      map.set(key, value);
      this.clubbedFieldMap.set(fieldName, map);
    }
  }

  private subSectionMapping(prefix: string, sectionType: string, subSectionGroupList: string[], start: boolean, parentField?: any) {
    if(this.formModelService.getSubSectionModel()!== undefined){
    const subsectionModel = this.formModelService.getSubSectionModel();
    this.setSubSectionGroupAndClubbedFields(prefix, subsectionModel[sectionType], subSectionGroupList, start, parentField);
    }
  }

  private setSubSectionGroupAndClubbedFields(prefix: string, subsectionModelObj: any, subSectionGroupList: string[], start: boolean,
                                             parentField?: any) {
    this.handleDynamicCriteriaForSubsection(prefix, subsectionModelObj, parentField);
    this.setSubSectionGroupFields(prefix, subsectionModelObj, subSectionGroupList, start);
    this.setSubsectionClubbedFields(prefix, subsectionModelObj);
  }

  private handleDynamicCriteriaForSubsection(prefix, subsectionModelObj, parentField) {
    Object.keys(subsectionModelObj).forEach(fieldName => {
      const subsectionField = subsectionModelObj[fieldName];
      const subsectionFieldName = subsectionField[this.name];
      const key = this.getProperFieldName(prefix, subsectionFieldName);
      this.setDynamicFieldsForSubsection(parentField, key);
    });
   }
  private setSubSectionGroupFields(prefix: string, subsectionModelObj: any, subSectionGroupList: string[], start: boolean) {
    let key: string;
    Object.keys(subsectionModelObj).forEach(fieldName => {
      const field = subsectionModelObj[fieldName];
      // Grouping
      const groupChildrenArray = field[this.groupChildren];
      if (groupChildrenArray) {
        const subsectionFieldName = field[this.name];
        key = this.getProperFieldName(prefix, subsectionFieldName);
        const value: string[] = [];
        Object.keys(groupChildrenArray).forEach(childfieldName => {
          value.push(this.getProperFieldName(prefix, groupChildrenArray[childfieldName].toString()));
        });
        const map: Map<string, string[]> = new Map();
        map.set(key, value);
        const hideHeader = field[this.hideGrpHeaderInView] === true ? true : false;
        if (hideHeader) {
          this.hideGrpHeaderList.push(key);
        }
        this.subGroupMap.set(key, map);
      }
    });

    // Adding subSectionGroupList to subGroupMap
    if (subSectionGroupList.length > 0) {
      if (start) {
        subSectionGroupList.reverse();
      }
      subSectionGroupList.forEach(field => {
        if (start) {
          this.subGroupMap.get(key).get(key).unshift(field);
        } else {
          this.subGroupMap.get(key).get(key).push(field);
        }
      });
    }
  }

  private setSubsectionClubbedFields(prefix: string, subsectionModelObj: any) {
    // Clubbing
    Object.keys(subsectionModelObj).forEach(fieldName => {
      const field = subsectionModelObj[fieldName];
      const clubbedListArray = field[this.clubbedList];
      if (clubbedListArray) {
        const properFieldName = this.getProperFieldName(prefix, field[this.name]);
        const key = field[this.clubbedHeaderText];
        const value: string[] = [];
        Object.keys(clubbedListArray).forEach(clubbedFieldName => {
          const properClubberFieldName = this.getProperFieldName(prefix, clubbedListArray[clubbedFieldName].toString());
          if (properClubberFieldName !== properFieldName && this.clubbedTrueFields.indexOf(properClubberFieldName) === -1) {
            this.clubbedTrueFields.push(properClubberFieldName);
          }
          value.push(properClubberFieldName);
        });
        const map: Map<string, string[]> = new Map();
        map.set(key, value);
        this.clubbedFieldMap.set(properFieldName, map);
      }
    });
  }

  setAmendClubFields() {
    for (let i = 0; i < this.formModel.length; i++) {
     if(this.formModel[i] !== undefined){
    const sectionNamesList = Object.keys(this.formModel[i]);
    sectionNamesList.forEach(sectionName => {
      const fieldsObj = this.formModel[i][sectionName];
      if (typeof fieldsObj === 'object') {
        Object.keys(fieldsObj).forEach(fieldName => {
          const field = fieldsObj[fieldName];
          if (field[this.amendClub]) {
            this.amendclubbedTrueFields.push(fieldName);
          }
        });
      }
    });
  }
  }
  }

  setGroupClubSectionsForAccordians() {
   const accordionPanelControlMap: Map<string, Map<string, FCCFormControl>>
    = this.formAccordionPanelService.getAccordionSectionControlMap();
   for (let i = 0; i < this.formModel.length; i++) {
    if(this.formModel[i] !== undefined){
      const sectionNamesList = Object.keys(this.formModel[i]);
      sectionNamesList.forEach(sectionName => {
      if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) !== -1 &&
        accordionPanelControlMap !== undefined && accordionPanelControlMap.has(sectionName)) {
          const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
          const accordionSubSectionAndControlsListMap = this.formAccordionPanelService.getAccordionSubSectionAndControlsListMap();
          const subSectionList = accordionSubSectionsListMap.get(sectionName);
          const subSectionControlsMap = accordionSubSectionAndControlsListMap.get(sectionName);
          subSectionList.forEach(subSection => {
            const subSectionControls = subSectionControlsMap.get(subSection);
            this.iterateControls(subSectionControls);
          });
        }
      });
    }
    }
  }

  getProperFieldName(prefix: string, subsectionFieldName: string): string {
    return prefix && prefix.concat(subsectionFieldName);
  }

  getSubGroupMap() {
    return this.subGroupMap;
  }

  getClubbedFieldMap() {
    return this.clubbedFieldMap;
  }

  getClubbedTrueFields() {
    return this.clubbedTrueFields;
  }

  getAmendClubbedTrueFields() {
    return this.amendclubbedTrueFields;
  }

  setEventModel(eventModel: any) {
    this.eventModel = eventModel;
  }

  getDynamicCretiraFields() {
    return this.dynamicCriteriaFields;
  }

  getHideGrpHeaderList() {
    return this.hideGrpHeaderList;
  }
}

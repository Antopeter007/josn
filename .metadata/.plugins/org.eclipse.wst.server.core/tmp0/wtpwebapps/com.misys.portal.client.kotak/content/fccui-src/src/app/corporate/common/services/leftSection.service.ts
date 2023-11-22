import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { CommonService } from './../../../common/services/common.service';
import { ProductStateService } from '../../trade/lc/common/services/product-state.service';
import { DynamicSection } from '../../../common/model/stepper-model';

@Injectable({
  providedIn: 'root'
})
export class LeftSectionService {
  enableLicenseSection: boolean;


  constructor( protected translateService: TranslateService , protected commonService: CommonService,
               protected stateService: ProductStateService) {}

  public progressBarData = new BehaviorSubject(0);
  public highlightMenuSection = new BehaviorSubject(0);
  public isButtonAction = new BehaviorSubject(false);

  public progressBarmap = new Map();
  lastSection: any;
  items: MenuItem[];
  steps: any[] = [];

  public reEvaluateProgressBar = new BehaviorSubject(false);
  public dynamicSection$ = new Subject<string>();

  // This function add the summary section for the tabbed form on the fly
  addSummarySection() {
    const valueArray = [];
    this.steps.forEach(step => {
      valueArray.push(step);
    });
    if (valueArray.indexOf('summaryDetails') === -1) {
      this.steps.push('summaryDetails');
    }
  }
  // This function removed the summary section on the fly.
  removeSummarySection() {
    this.steps.forEach(step => {
      const value = this.steps[step];
      if (value === 'summaryDetails') {
        this.steps.splice(step, 1);
      }
    });
  }
  /*calling the initialization for mapping from tab-section*/
  progressBarMapping(items) {
    this.steps = items;
    for (let i = 0; i < this.steps.length; i++) {
        if (this.steps[i] !== FccGlobalConstant.SUMMARY_DETAILS) {
          this.progressBarmap.set(this.steps[i], false);
        }
        if (i === this.steps.length - 1) {
          if (this.steps[i] === FccGlobalConstant.SUMMARY_DETAILS) {
            this.lastSection = this.steps[i - 1];
          } else {
            this.lastSection = this.steps[i];
          }
        }
      }

  }

putProgressBardata(key, data) {
  if (key) {
    this.progressBarmap.set(key, data);
  }
  }

getSectionProgressBarData(key) {
    return this.progressBarmap.get(key);
  }

resetProgressBarMap() {
    this.progressBarmap.clear();
  }

progressBarPerIncrease(key) {
    const stepSize = this.progressBarmap.has(FccGlobalConstant.SUMMARY_DETAILS) ?
    this.progressBarmap.size - FccGlobalConstant.LENGTH_1 : this.progressBarmap.size;
    const barLen = Math.round((FccGlobalConstant.LENGTH_100 / stepSize));
    if (key !== this.lastSection) {
      return barLen;
      } else {
        return (
          FccGlobalConstant.LENGTH_100 - barLen * (this.progressBarmap.size - FccGlobalConstant.LENGTH_1)
        );
      }
  }

/**
 * Add a conditional section on the fly.
 *
 * Index is optional- if index not provided, section is added as per order defined in formmodel.
 * @param sections - array of dynamicSections to be added
 */
  public addDynamicSection(sections: DynamicSection[]) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const operation = this.commonService.getQueryParametersFromKey('operation');

    sections.forEach(section => {
      if (this.steps.indexOf(section.sectionName) === -1) {
        const idx = section.index !== undefined ? section.index : this.stateService.getSectionIndex(section.sectionName);
        this.steps.splice(idx, FccGlobalConstant.LENGTH_0, section.sectionName);
        this.stateService.addDynamicSectionToStateData(section.sectionName);
        if (mode === FccGlobalConstant.DRAFT_OPTION || operation === 'LIST_INQUIRY' || operation === 'PREVIEW') {
          // populate section with transaction details
          this.dynamicSection$.next(section.sectionName);
        }
        this.progressBarmap.set(section.sectionName, false);
        this.reEvaluateProgressBar.next(true);
      }
    });
  }

/**
 * removes a conditional sections on the fly.
 * accepts array of sections to be removed.
 *
 * @param sections - DynamicSection
 */
  public removeDynamicSection(sections: DynamicSection[]) {
     sections.forEach(section => {
      if (this.steps.indexOf(section.sectionName) !== -1) {
        this.steps.splice(this.steps.indexOf(section.sectionName), FccGlobalConstant.LENGTH_1);
        this.stateService.removeDynamicSectionToStateData(section.sectionName);
        this.progressBarmap.delete(section.sectionName);
        this.reEvaluateProgressBar.next(true);
      }
    });
  }

  public removeSectionAndShowPreview(sections: DynamicSection[]) {
    sections.forEach(section => {
     if (this.steps.indexOf(section.sectionName) !== -1) {
       this.steps.splice(this.steps.indexOf(section.sectionName), FccGlobalConstant.LENGTH_1);
       this.progressBarmap.delete(section.sectionName);
       this.reEvaluateProgressBar.next(true);
     }
   });
 }

    public handleLicenseSection(steps: any) {
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          this.enableLicenseSection = response.showLicenseSection;
          steps.forEach(step => {
            if (step === FccGlobalConstant.LICENSE_DETAILS && !this.enableLicenseSection) {
              const index = steps.findIndex(value => value === FccGlobalConstant.LICENSE_DETAILS);
              steps.splice(index, 1);
              this.progressBarmap.delete(FccGlobalConstant.LICENSE_DETAILS);
              } else if (step === FccGlobalConstant.EL_LICENSE_DETAILS && !this.enableLicenseSection) {
                const index = steps.findIndex(value => value === FccGlobalConstant.EL_LICENSE_DETAILS);
                steps.splice(index, 1);
                this.progressBarmap.delete(FccGlobalConstant.EL_LICENSE_DETAILS);
                } else if (step === FccGlobalConstant.EC_LICENSE_DETAILS && !this.enableLicenseSection) {
                const index = steps.findIndex(value => value === FccGlobalConstant.EC_LICENSE_DETAILS);
                steps.splice(index, 1);
                this.progressBarmap.delete(FccGlobalConstant.EC_LICENSE_DETAILS);
                } else if (step === FccGlobalConstant.TF_LICENSE_DETAILS && !this.enableLicenseSection) {
                  const index = steps.findIndex(value => value === FccGlobalConstant.TF_LICENSE_DETAILS);
                  steps.splice(index, 1);
                  this.progressBarmap.delete(FccGlobalConstant.TF_LICENSE_DETAILS);
                } else if (step === FccGlobalConstant.FT_TRADE_LICENSE_DETAILS && !this.enableLicenseSection) {
                  const index = steps.findIndex(value => value === FccGlobalConstant.FT_TRADE_LICENSE_DETAILS);
                  steps.splice(index, 1);
                  this.progressBarmap.delete(FccGlobalConstant.FT_TRADE_LICENSE_DETAILS);
                }
                else if (step === FccGlobalConstant.UI_LICENSE_DETAILS && !this.enableLicenseSection) {
                  const index = steps.findIndex(value => value === FccGlobalConstant.UI_LICENSE_DETAILS);
                  steps.splice(index, 1);
                  this.progressBarmap.delete(FccGlobalConstant.UI_LICENSE_DETAILS);
                }
              });
            }
        });
    }

    getIsEnableLicenseSection() {
      return this.enableLicenseSection;
    }

    public handleDeliveryInstructionsSection(steps: any) {
      this.commonService.getSwiftVersionValue();
      steps.forEach(step => {
        if (step === FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS && this.commonService.swiftVersion !== FccGlobalConstant.SWIFT_2021) {
          const index = steps.findIndex(value => value === FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS);
          steps.splice(index, 1);
          this.progressBarmap.delete(FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS);
        }
      });
    }

  setStepperSteps(items) {
    this.steps = items;
  }
}

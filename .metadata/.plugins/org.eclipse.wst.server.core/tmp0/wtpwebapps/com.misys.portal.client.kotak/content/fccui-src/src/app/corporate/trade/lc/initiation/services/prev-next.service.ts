import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PrevNextService {
  constructor() {
    //eslint : no-empty-function
  }
  getPrevLayoutClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'prevSectionDivIE';
    } else {
      return 'p-col-12 p-md-12 p-lg-12 p-sm-12 prevSectionDiv';
    }
  }

  getNextLayoutClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'nextSectionDivIE';
    } else {
      return 'nextSectionDiv';
    }
  }

  getCancelLayoutClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'prevSectionDivIE';
    } else {
      return 'prevSectionDiv';
    }
  }

  getSubmitLayoutClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'nextSectionDivIE';
    } else {
      return 'nextSectionDiv';
    }
  }

  getPrevStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'primaryButton previousIE';
    } else {
      return 'primaryButton previousArabic';
    }
  } else {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'primaryButton previousIE';
    } else {
      return 'primaryButton previous';
    }
  }
  }

  getNextStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'primaryButton nextButtonIE';
    } else {
      return 'primaryButton nextButtonArabic';
    }
  } else {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'primaryButton nextButtonIE';
    } else {
      return 'primaryButton nextButton';
    }
  }
  }

  getCancelStyleClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'tertiaryButton previousIE';
    } else {
      return 'tertiaryButton cancelButtonAlign';
    }
  }

  getSubmitStyleClass() {
    if (navigator.userAgent.indexOf('Trident') !== -1 ) { // IE Browser Engine.
      return 'secondaryButton nextButtonIE';
    } else {
      return 'secondaryButton submitButtonAlign';
    }
  }

buildPrevNextSection(form: FCCFormGroup, buttonType: any): any {
    const obj = {};
    const name = 'name';
    const displayValue = 'displayValue';
    const layoutClass = 'layoutClass';
    const styleClass = 'styleClass';
    const displayKey = 'displayKey';
    const type = 'type';

    obj[name] = buttonType;
    obj[displayValue] = true;
    obj[layoutClass] = this.getLayoutClass(buttonType);
    obj[styleClass] = this.getStyleClass(buttonType);
    obj[displayKey] = buttonType + 'Display';
    obj[type] = 'button-div';
    return obj;
  }

  getLayoutClass(buttonType: string): string {
    let layoutClass = '';
    switch (buttonType) {
      case 'previous':
        layoutClass = this.getPrevLayoutClass();
        break;
      case 'next':
        layoutClass = this.getNextLayoutClass();
        break;
      case 'submit':
        layoutClass = this.getSubmitLayoutClass();
        break;
      case 'cancel':
        layoutClass = this.getCancelLayoutClass();
        break;
      case 'save':
          layoutClass = this.getNextLayoutClass();
    }
    return layoutClass;
  }

  getStyleClass(buttonType: string): string {
    let styleClass = '';
    switch (buttonType) {
      case 'previous':
        styleClass = this.getPrevStyleClass();
        break;
      case 'next':
        styleClass = this.getNextStyleClass();
        break;
      case 'submit':
        styleClass = this.getSubmitStyleClass();
        break;
      case 'cancel':
        styleClass = this.getCancelStyleClass();
        break;
      case 'save':
        styleClass = this.getNextStyleClass();
    }
    return styleClass;
  }
}


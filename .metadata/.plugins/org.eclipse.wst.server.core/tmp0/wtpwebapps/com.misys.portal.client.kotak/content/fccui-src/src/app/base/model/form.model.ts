import { UntypedFormControl, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
export class ProductFormControl extends UntypedFormControl {
    label: string;
    modelProperty: string;
    styleClass: string[];
    type: string;
    layoutClass: string;
    constructor(params: {
      key?: string,
      label?: string,
      controlType?: string,
      style?: string[],
      layoutClass?: string
    } = {},
                value: any,
                validator: any, ) {
        super(value, validator);
        this.label = params.label;
        this.modelProperty = params.key;
        this.styleClass = params.style;
        this.type = params.controlType;
        this.layoutClass = params.layoutClass;

    }

    getStyle(): string {
      if (this.styleClass === undefined || this.styleClass.length <= 0) {
         return '';
      }
      return this.styleClass.join(' ');
    }

    getValidationMessages() {
        const messages: string[] = [];
        if (this.errors) {
            // eslint-disable-next-line guard-for-in
            for (const errorName in this.errors) {
                switch (errorName) {
                    case 'required':
                        messages.push(`You must enter a ${this.label}`);
                        break;
                    case 'minlength':
                        messages.push(`A ${this.label} must be at least
                            ${this.errors['minlength'].requiredLength}
                            characters`);
                        break;
                    case 'maxlength':
                        messages.push(`A ${this.label} must be no more than
                            ${this.errors['maxlength'].requiredLength}
                            characters`);
                        break;
                    case 'pattern':
                        messages.push(`The ${this.label} contains
                             illegal characters`);
                        break;
                }
            }
        }
        return messages;
    }
}


export class DropdownFormControl extends ProductFormControl {
  options: {key: string, value: string}[] = [];


  constructor(params: {} = {}, value: any, validator: any) {
      super(params, value, validator);
      this.options = params['options'];

  }
}


export class DropdownFilterFormControl extends ProductFormControl {
  options: {key: string, value: string}[] = [];
  constructor(params: {} = {}, value: any, validator: any) {
      super(params, value, validator);
      this.options = params['options'];
  }
}

export class RadioGroupFormControl extends ProductFormControl {
  options: string[] = [];

  constructor(params: {} = {}, value: any, validator: any) {
      super(params, value, validator);
      this.options = params['options'];

  }
}

export class TemplateControl extends ProductFormControl {
  context: any;
    constructor(params: {} = {}, context: any) {
      super(params, null, null);
      this.context = context;

  }
}

export class ProductFormGroup extends UntypedFormGroup {
    constructor(control: {[key: string]: AbstractControl}) {
        super(control);
    }

    get productControls(): ProductFormControl[] {
        return Object.keys(this.controls)
            .map(k => this.controls[k] as ProductFormControl);
    }

    addFCCValidators(key: string , validators: any , mode: number ): void {
      const field = (this.get(key) as UntypedFormControl);
      try {
        if (mode === 0) {
          field.setValidators(Validators.compose([field.validator, validators]));
        } else if (mode === 1) {
          field.setValidators(validators);
        }
      } catch (error) {
        // do nothing
      }
    }

    replaceControl(key: string , control1: ProductFormControl): void {
      let prevKey = '';
      const keyArray = Object.keys(this.controls);
      for (const value of keyArray) {
        const ele = value;
        if (ele === key) {
          break;
        }
        prevKey = ele;
      }
      /*.forEach(ele => {

        if (ele === key){
          break;
        }
        prevKey = ele;

      });*/
      this.removeControl(key);
      this.addControlAtPos(key, control1, prevKey);
    }

    addControlAtPos(key: string , control1: ProductFormControl, insertId: string): void {
      // const formArr = <FormArray>this.controls.;
      // this.insert(index, control1);
      // this.controls.

      /*

      let newControls = {};

      let keys=Object.keys(this.controls);

      for(i=0;i<Object.keys(this.controls).s;i++)
      this.controls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

      controls: {
        [key: string]: AbstractControl;
    };*/

    const fg = new UntypedFormGroup({});
    Object.keys(this.controls).forEach(ele => {
      fg.addControl(ele, this.controls[ele]);
      if (ele === insertId) {
        fg.addControl(key, control1);
      }
    });
    this.controls = fg.controls;

    }

    getFormValidationMessages(form: any): string[] {
        const messages: string[] = [];
        this.productControls.forEach(c => c.getValidationMessages()
            .forEach(m => messages.push(m)));
        return messages;
    }

    updateLabel(key: string, newLabel: string): void {
     const control1 = (this.get(key) as ProductFormControl);
     control1.label = newLabel;
    }

    udpateStyle(key: string, newStyle: string[], mode: number): void {
      const control1 = (this.get(key) as ProductFormControl);
      if (mode === 0) {
        if (control1.styleClass === undefined || control1.styleClass.length <= 0 ) {
          control1.styleClass = newStyle;
        } else {

          control1.styleClass = control1.styleClass.concat(newStyle);

        }
      } else if (mode === 1) {
        control1.styleClass = newStyle;
      }
     }

    isChecked(value: string): string {
        if (value.toLowerCase() === 'true' || value === 'T' || value === 'Y'  ) {
          return 'true';
        } else {
          return '';
        }
    }
}

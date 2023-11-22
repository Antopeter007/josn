import { FCCFormControl } from '../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';

export function oldNewPassChecker(control: FCCFormControl) {
 if (control && control.value !== null && control.value !== undefined) {
  const passVal = control.value;
  const oldPassControl = control.root.get('ftUserCurrentPwd');
  if (oldPassControl) {
    const oldVal = oldPassControl.value;
    if (oldVal === passVal) {
        return {
        oldnewPwdSame: true
      };
    }
  }
 }
 return null;
}

export function validOtpChecker(control: FCCFormControl) {
  if (control && control.value !== null && control.value !== undefined) {
   const passControl = control.root.get('enteredOtp');
   const data: any = passControl;
   if (passControl) {
     const password: string = passControl.value;
     if (password.length.toString() !== data.params.maxlength) {
         return {
          InvalidOtpCheck: true
       };
     }
   }
  }
  return null;
 }

export function newconfirmPassChecker(control: FCCFormControl) {
  if (control && control.value !== null && control.value !== undefined) {
   const confrmPassVal = control.value;
   const newPassControl = control.root.get('ftUserNewPwd');
   if (newPassControl) {
     const newPassVal = newPassControl.value;
     if (newPassVal !== confrmPassVal) {
         return {
          newConfrmpasswordMismatch: true
       };
     }
   }
  }
  return null;
 }

export function confirmNewPassChecker(control: FCCFormControl) {
  if (control && control.value !== null && control.value !== undefined) {
   const confirmPassControl = control.root.get('ftUserConfrmPwd');
   if (confirmPassControl) {
     const newPasswordVal = confirmPassControl.value;
     if (newPasswordVal !== confirmPassControl) {
         return {
          newConfrmpasswordMismatch: true
       };
     }
   }
  }
  return null;
 }

 export function multipleEmailValidation(control: FCCFormControl) {
  let emailError = false;
  let msgTypeError = null;
  if (control && control.value !== '' && control.value !== undefined && control.value !== null) {
    const emaildIds:any = control.value.split(",");
    if(emaildIds.length > control.params.multiValueLimit){
      msgTypeError = { maxEmailIDs: true };
    }else{
      emaildIds.forEach((email)=>{
        if(!new RegExp(FccGlobalConstant.EMAIL_VALIDATION).test(email)){
          emailError = true;
        }
      });
      if (emailError) {
        msgTypeError = { validEmailIDs: true };
      }
    }
  }
  return msgTypeError;
 }


import { Constants } from '../../constants';
import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { EncryptDecryptService } from '../../services/encryptDecrypt.service';


@Component({
  selector: 'fcc-common-reauth-dialog',
  templateUrl: './reauth-dialog.component.html',
  styleUrls: ['./reauth-dialog.component.scss']
})
export class ReauthDialogComponent implements OnInit {

  reauthForm: UntypedFormGroup;
  public enableReauthPopup = false;
  public showReauthFailureAlert: boolean;
  public showPasswordAlert: boolean;
  public enableErrorPopup: boolean;
  @Output() callReauthSubmit = new EventEmitter<any>();
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  ngOnInit() {

    this.reauthForm = this.fb.group({
      reauthPerform:  '',
      reauthPassword:  '',
      clientSideEncryption: ''
    });
     // Emit the form group to the parent
    this.formReady.emit(this.reauthForm);
  }

  constructor(protected fb: UntypedFormBuilder,
              public commonService: CommonService, public encrDecr: EncryptDecryptService) {}

  onReauthSubmit() {
    let reauthPass = this.reauthForm.get('reauthPassword').value;
    if (reauthPass === '' || reauthPass === null) {
      this.showPasswordAlert = true;
    } else {
      this.enableReauthPopup = false;
      // If client side encryption is enabled set the value to 'Y', and encrypt the password.
      if (this.commonService.getClientSideEncryptionEnabled()) {
        this.encrDecr.generateKeys().subscribe(
          data => {
            const keys = data.keys;
            const htmlUsedModulus = keys.htmlUsedModulus;
            const crSeq = keys.cr_seq;
            reauthPass = this.encrDecr.encryptText(reauthPass, htmlUsedModulus, crSeq);
            this.reauthForm.get('reauthPerform').setValue('Y');
            this.reauthForm.get('reauthPassword').setValue(reauthPass);
            this.reauthForm.get('clientSideEncryption').setValue('Y');
            this.callReauthSubmit.emit(true);
          }
        );
      } else {
        this.reauthForm.get('reauthPerform').setValue('Y');
        this.reauthForm.get('reauthPassword').setValue(reauthPass);
        this.reauthForm.get('clientSideEncryption').setValue('N');
        this.callReauthSubmit.emit(true);
      }
    }
  }

  onReauthSubmitCompletion(reauthResponse) {
    if (reauthResponse === Constants.RESPONSE_REAUTH_FAILURE) {
      this.showReauthFailureAlert = true;
    }

  }

  onReauthCancel() {
    this.enableReauthPopup = false;
  }

}

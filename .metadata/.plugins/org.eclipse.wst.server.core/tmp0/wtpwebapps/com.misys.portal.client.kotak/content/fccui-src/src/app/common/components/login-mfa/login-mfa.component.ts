import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcc-common-login-mfa',
  template: `<div class="p-grid entirePage">
    <div class="p-col-12 p-md-12 p-lg-5 left-form">
    <div>
        <fcc-common-login-auth></fcc-common-login-auth>
    </div>
    </div>
    <div class="p-col-12 p-md-12 p-lg-7 p-sm-12 no-mr-pd">
      <fcc-common-background-image></fcc-common-background-image>
    </div>
  </div>`,
  styleUrls: ['./login-mfa.component.scss']
})
export class LoginMfaComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit() {
    //eslint : no-empty-function
  }

}

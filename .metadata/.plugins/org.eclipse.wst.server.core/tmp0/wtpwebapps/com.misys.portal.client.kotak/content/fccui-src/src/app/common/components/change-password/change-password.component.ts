import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcc-common-change-password',
  template: `<div class="p-grid entirePage">
  <div class="p-col-12 p-md-12 p-lg-5 left-form side_bar">
  <div>
      <fcc-common-change-password-details></fcc-common-change-password-details>
  </div>
</div>
<div class="p-col-12 p-md-12 p-lg-7 p-sm-12 no-mr-pd">
  <fcc-common-background-image></fcc-common-background-image>
</div>
</div>`,
styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit() {
    //eslint : no-empty-function
  }

}

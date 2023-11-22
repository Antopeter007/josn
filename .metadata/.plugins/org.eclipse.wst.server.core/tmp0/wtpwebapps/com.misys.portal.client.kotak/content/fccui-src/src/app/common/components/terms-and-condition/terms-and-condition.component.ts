import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcc-common-terms-and-condition',
  template: `<div class="p-grid entirePage">
  <div class="p-col-12 p-md-12 p-lg-5 left-form header1">
      <div>
          <fcc-common-terms-and-condition-details></fcc-common-terms-and-condition-details>
      </div>
  </div>
  <div class="p-col-12 p-md-12 p-lg-7 p-sm-12 no-mr-pd header1">
      <fcc-common-background-image></fcc-common-background-image>
  </div>
</div>`,
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit() {
    //eslint : no-empty-function
  }
}

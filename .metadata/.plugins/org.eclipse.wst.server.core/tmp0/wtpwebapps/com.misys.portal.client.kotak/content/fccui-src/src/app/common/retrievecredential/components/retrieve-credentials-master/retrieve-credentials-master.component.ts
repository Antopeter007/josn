import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcc-app-retrieve-credentials-master',
  template: `<div class="p-grid entirePage">
  <div class="p-col-12 p-md-12 p-lg-6 left-form">
  <div>
      <fcc-app-retrieve-credentials></fcc-app-retrieve-credentials>
  </div>
</div>
<div class="p-col-12 p-md-12 p-lg-6 p-sm-12 no-mr-pd">
  <fcc-common-background-image></fcc-common-background-image>
</div>
</div>`,
  styleUrls: ['./retrieve-credentials-master.component.scss']
})
export class RetrieveCredentialsMasterComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit(): void {
    //eslint : no-empty-function
  }

}

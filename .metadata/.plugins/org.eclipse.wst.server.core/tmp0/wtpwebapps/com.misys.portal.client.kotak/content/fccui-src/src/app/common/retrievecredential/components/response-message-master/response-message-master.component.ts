import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcc-response-message-master',
  template: `<div class="p-grid entirePage">
  <div class="p-col-12 p-md-12 p-lg-6">
  <div>
      <fcc-response-message></fcc-response-message>
  </div>
</div>
<div class="p-col-12 p-md-12 p-lg-6 p-sm-12 no-mr-pd">
  <fcc-common-background-image></fcc-common-background-image>
</div>
</div>`,
  styleUrls: ['./response-message-master.component.scss']
})
export class ResponseMessageMasterComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
   }

  ngOnInit(): void {
    //eslint : no-empty-function
  }

}

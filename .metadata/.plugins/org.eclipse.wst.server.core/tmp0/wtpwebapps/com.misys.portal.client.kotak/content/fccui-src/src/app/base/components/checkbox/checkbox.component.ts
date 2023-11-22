import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcc-common-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  constructor() {}

  checkidx: any;
  checkValue: any;
  checkLabel: any;
  checkAriaLabel: any;
  checkAriaRequired: any;
  checkSelectedValues: any;

  @Input()
  params: any = [];

  ngOnInit() {
    this.params = this.params !== undefined ? this.params : {};
  }
}

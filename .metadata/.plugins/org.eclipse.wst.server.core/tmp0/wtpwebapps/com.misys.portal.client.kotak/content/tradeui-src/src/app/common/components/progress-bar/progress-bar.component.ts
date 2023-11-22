import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcc-common-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input() showProgressBar = false;
  @Input() displayMessage: string;

  constructor() { }

  ngOnInit() {
  }

}

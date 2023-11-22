import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-info-icon-details',
  templateUrl: './info-icon-details.component.html',
  styleUrls: ['./info-icon-details.component.scss']
})
export class InfoIconDetailsComponent implements OnInit {

  @Input() infoIconDetails: any = [];
  showHeaderToolTip = '';
  constructor(protected commonService: CommonService) { }

  ngOnInit(): void {
    this.showHeaderToolTip = this.infoIconDetails.details;
  }

  getTootlTipProperties() {
    const className = this.infoIconDetails.style ? this.infoIconDetails.style : 'tooltip-style';
    return className;
  }

  getClassForEm() {
    const classProperty = this.infoIconDetails.iconStyle ? this.infoIconDetails.iconStyle : 'material-icons visibleMatIcon';
    return classProperty;
  }

}

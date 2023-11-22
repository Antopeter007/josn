import { Component, Input, OnInit } from '@angular/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';

@Component({
  selector: 'app-widget-static-text',
  templateUrl: './widget-static-text.component.html',
  styleUrls: ['./widget-static-text.component.scss']
})
export class WidgetStaticTextComponent implements OnInit {
  @Input() textDetails: any = [];
  textMessage = '';
  staticTextStyle: any = {};
  constructor() {
    //eslint : no-empty-function
  }

  ngOnInit(): void {
    this.textMessage = this.textDetails[FccGlobalConstant.STATIC_TEXT_MESSAGE];
    this.staticTextStyle[FccGlobalConstant.FONT_SIZE] = this.textDetails[FccGlobalConstant.FONT_SIZE];
    this.staticTextStyle[FccGlobalConstant.FONT_COLOR] = this.textDetails[FccGlobalConstant.FONT_COLOR];
    this.staticTextStyle[FccGlobalConstant.WIDTH] = this.textDetails[FccGlobalConstant.WIDTH];
    this.staticTextStyle[FccGlobalConstant.POSITION] = this.textDetails[FccGlobalConstant.POSITION];
  }

}

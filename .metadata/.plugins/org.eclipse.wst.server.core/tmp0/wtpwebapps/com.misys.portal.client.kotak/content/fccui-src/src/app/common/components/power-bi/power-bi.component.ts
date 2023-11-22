/**
 * Component to render Power BI report into the Application
 */
import { Component, OnInit } from '@angular/core';
import * as pbi from 'powerbi-client';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SessionValidateService } from '../../services/session-validate-service';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';

@Component({
  selector: 'fcc-common-power-bi',
  templateUrl: './power-bi.component.html',
  styleUrls: ['./power-bi.component.scss']
})
export class PowerBIComponent implements OnInit {

  private pbiContainerElement: HTMLElement;
  reportId: string;
  embedToken: any;
  filterPaneEnabled: string;
  navigationPaneEnabled: string;
  embedUrl: string;
  productKey: string;

  constructor(protected router: Router ,
              protected commonService: CommonService,
              protected sessionValidation: SessionValidateService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected activatedRoute: ActivatedRoute) {
    const productKey = this.activatedRoute.snapshot.paramMap.get('productKey');
    this.productKey = productKey;
  }

  ngOnInit() {
    this.pbiContainerElement = (
      document.getElementById('reportContainer')
    );
    this.generateReport();
}
  /**
   * Main function to use the power bi client library and embed the report
   */
  private embedReport(): void {
    const powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    const embedConfig = this.buildEmbedConfig();
    powerbi.reset(this.pbiContainerElement);
    powerbi.embed(this.pbiContainerElement, embedConfig);
  }
  /**
   * Function to build the report using the Power BI Client library configuration parameters
   */
  private buildEmbedConfig() {
    return {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: this.embedToken,
      embedUrl: this.embedUrl,
      id: this.reportId,
      permissions: pbi.models.Permissions.All,
      settings: {
        filterPaneEnabled: Boolean(JSON.parse(this.navigationPaneEnabled)),
        navContentPaneEnabled: Boolean(JSON.parse(this.filterPaneEnabled))
      }
    } as pbi.IEmbedConfiguration;
  }
  /**
   * Function to call the Embed token API on the FCC Server side in order to fetch the embed token
   */
  generateReport(): void {
    this.commonService.getEmbedToken(this.productKey).subscribe(
      data => {
        if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (data.response && data.response === 'REST_API_SUCCESS') {
          this.embedToken = data.embedToken;
          this.embedUrl = data.embedUrl;
          this.reportId = data.reportId;
          this.filterPaneEnabled = data.filterPaneEnabled;
          this.navigationPaneEnabled = data.navigationPaneEnabled;
          this.embedReport();
        }
      },
      () => {this.sessionValidation.IsSessionValid(); }
    );
  }
}

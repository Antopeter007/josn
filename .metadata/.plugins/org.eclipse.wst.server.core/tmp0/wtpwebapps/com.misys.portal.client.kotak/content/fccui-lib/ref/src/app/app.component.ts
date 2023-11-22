/* tslint:disable */

import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppComponent, CheckTimeoutService, CommonService, FccGlobalConfiguration, ResolverService, UtilityService, CustomHeaderService, FormControlResolverService, EncryptionService } from 'fccui';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class ClientAppComponent extends AppComponent implements OnInit {

    
    constructor(
        public translate: TranslateService, public router: Router, protected commonService: CommonService,
        protected fccGlobalConfiguration: FccGlobalConfiguration, protected checkTimeoutService: CheckTimeoutService,
        protected activatedRoute: ActivatedRoute, protected titleService: Title, protected customHeaderService: CustomHeaderService,
        public dateAdapter: DateAdapter<any>, protected resolverService: ResolverService, protected utilityService: UtilityService,
        protected formControlResolver: FormControlResolverService,
        @Inject(DOCUMENT) public document: any, protected metaService: Meta,protected encryptionService:EncryptionService) {
            super(translate, router, commonService, fccGlobalConfiguration, checkTimeoutService,
                activatedRoute, titleService, customHeaderService, dateAdapter, resolverService, utilityService,formControlResolver, document, metaService, encryptionService);
    }
}    

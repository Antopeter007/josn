import { MatSidenavModule } from '@angular/material/sidenav';
/* tslint:disable */

import { ClientAppComponent } from './app.component';
import {
    FccTranslationService, CheckTimeoutService, DynamicContentComponent, ComponentService, FccCorporateModule,
    FccCommonModule, FccGlobalConstant, CalendarComponent, CheckboxComponent, InputTextComponent,
    RadioButtonComponent, AmountComponent, Interceptor, MultiselectComponent, FormResolverModule,
    InputtextareaComponent, FccRetrievecredentialModule, AppModule, UtilityService, LocaleService } from 'fccui';
import { OverlayModule } from '@angular/cdk/overlay';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SidebarModule } from 'primeng/sidebar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
const contextPath = window[FccGlobalConstant.CONTEXT_PATH];
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';
import localeUS from '@angular/common/locales/en';
import { AppRoutingModule } from './app-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RatingModule } from 'primeng/rating';

registerLocaleData(localeFr);
registerLocaleData(localeAr);
registerLocaleData(localeUS);

declare global {
    interface Navigator {
     msSaveOrOpenBlob: (blob: Blob,fileName?:any) => void
   }
 }
 
const globalSettings = window[FccGlobalConstant.SITE_KEY];
@NgModule({
    declarations: [
        ClientAppComponent
    ],
    imports: [
        AppRoutingModule,
        AppModule,
        RatingModule,
        MatSlideToggleModule,
        CardModule,
        MatRadioModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule,
        MatCardModule,
        InputTextModule,
        ReactiveFormsModule,
        BrowserModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        BrowserAnimationsModule,
        FccCommonModule,
        MultiSelectModule,
        TableModule,
        FormsModule,
        CalendarModule,
        MessageModule,
        TabViewModule,
        CheckboxModule,
        RadioButtonModule,
        RecaptchaV3Module,
        DropdownModule,
        FccCorporateModule,
        InputSwitchModule,
        ProgressBarModule,
        RouterModule.forRoot([], { useHash: true, relativeLinkResolution: 'legacy' }),
        OverlayModule,
        HttpClientModule,
        SidebarModule,
        SlideMenuModule,
        FccRetrievecredentialModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: FccTranslationService,
                deps: [HttpClient]
            }
        }),
        BreadcrumbModule,
        MenubarModule,
        OverlayPanelModule,
        ToastModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'x-xsrf-token'
        }),
        NgIdleModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        MatExpansionModule,
        MatSidenavModule,
        AngularEditorModule,
        FormResolverModule
    ],
    providers: [CheckTimeoutService, ComponentService, CurrencyPipe, UtilityService, LocaleService,
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: globalSettings },
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: globalSettings } as RecaptchaSettings },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: LOCALE_ID, useValue: 'ar' },
        { provide: LOCALE_ID, useValue: 'en' },
        Title
    ],
    bootstrap: [ClientAppComponent]
})
export class ClientAppModule {

}


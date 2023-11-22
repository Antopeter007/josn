import { LocaleService } from './base/services/locale.service';
import { FccGlobalConstant } from '../app/common/core/fcc-global-constants';
import { OverlayModule } from '@angular/cdk/overlay';
import { FccCorporateModule } from './corporate/fcc-corporate.module';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ComponentService } from './base/services/component.service';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FccCommonModule } from './common/fcc-common.module';
import { CheckTimeoutService } from './common/services/check-timeout-service';
import { DynamicContentComponent } from './base/components/dynamic-content.component';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './base/components/calendar/calendar.component';
import { CheckboxComponent } from './base/components/checkbox/checkbox.component';
import { InputTextComponent } from './base/components/input-text/input-text.component';
import { RadioButtonComponent } from './base/components/radio-button/radio-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AmountComponent } from './base/components/amount/amount.component';
import { DropdownModule } from 'primeng/dropdown';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { Interceptor } from './Interceptor';
import { MessageModule } from 'primeng/message';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { MultiselectComponent } from './base/components/multiselect/multiselect.component';
import { InputtextareaComponent } from './base/components/inputtextarea/inputtextarea.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SidebarModule } from 'primeng/sidebar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FccRetrievecredentialModule } from './common/retrievecredential/fcc-retrievecredential.module';
import { FccTranslationService } from './translateservice/fcc-Translation.Service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CurrencyPipe, registerLocaleData, TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';
import localeUS from '@angular/common/locales/en';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationGuardDialogComponent } from './confirmation-guard-dialog/confirmation-guard-dialog.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
registerLocaleData(localeFr);
registerLocaleData(localeAr);
registerLocaleData(localeUS);
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomDateAdapter } from './CustomDateAdapter';
import { FormControlResolverModule } from './shared/FCCform/form-controls/form-control-resolver/form-control-resolver.module';
import { FORM_CONTROL_REGISTRATION_CONFIG, FORM_REGISTERED_MODULES } from './shared/FCCform/form-controls/registration.config';
import { MenuComponent } from './common/widgets/components/menu/menu.component';
import { SubMenuComponent } from './common/widgets/components/sub-menu/sub-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { UtilityService } from './corporate/trade/lc/initiation/services/utility.service';
import { CustomHeaderService } from './custom-header.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChartsModule } from 'ng2-charts';
import { FormResolverModule } from './shared/FCCform/form/form-resolver/form-resolver.module';
import { NewPhraseComponent } from './common/components/new-phrase/new-phrase.component';

declare global {
    interface Navigator {
     msSaveOrOpenBlob: (blob: Blob,fileName?:any) => void
   }
 }

const globalSettings = window[FccGlobalConstant.SITE_KEY];
@NgModule({
    declarations: [
        AppComponent,
        DynamicContentComponent,
        CalendarComponent,
        CheckboxComponent,
        InputTextComponent,
        RadioButtonComponent,
        AmountComponent,
        MultiselectComponent,
        InputtextareaComponent,
        HeaderComponent,
        FooterComponent,
        ConfirmationGuardDialogComponent,
        MenuComponent,
        SubMenuComponent,
        CustomHeaderComponent
    ],
    imports: [
        MatIconModule,
        MatTooltipModule,
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
        AccordionModule,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatAutocompleteModule,
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
        MatToolbarModule,
        MatTooltipModule,
        FormResolverModule,
        ...FORM_REGISTERED_MODULES,
        FormControlResolverModule.forRoot(FORM_CONTROL_REGISTRATION_CONFIG),
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        ChartsModule,
        DynamicDialogModule,
        DialogModule
    ],
    exports: [HeaderComponent, FooterComponent],
    providers: [CheckTimeoutService, ComponentService, CurrencyPipe, DynamicDialogRef, DynamicDialogConfig, UtilityService, LocaleService,
        CustomHeaderService, AngularEditorModule,
        NewPhraseComponent, TitleCasePipe,
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: globalSettings },
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: globalSettings } as RecaptchaSettings },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: LOCALE_ID, useValue: 'ar' },
        { provide: LOCALE_ID, useValue: 'en' },
        Meta,
        Title
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}

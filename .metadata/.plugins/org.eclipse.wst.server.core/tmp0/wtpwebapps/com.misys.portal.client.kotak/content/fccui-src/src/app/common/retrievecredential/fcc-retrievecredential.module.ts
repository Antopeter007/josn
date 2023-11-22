import { FccLiModule } from './../../corporate/trade/li/fcc-li.module';
import { FccSgModule } from './../../corporate/trade/sg/fcc-sg.module';
import { FccIcModule } from './../../corporate/trade/ic/fcc-ic.module';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module } from 'ng-recaptcha';
import { CookieModule } from 'ngx-cookie';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CaptchaModule } from 'primeng/captcha';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { FccElModule } from './../../corporate/trade/el/fcc-el.module';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FccCommonRoutes } from '../fcc-common.routes';
import { FccLcModule } from './../../corporate/trade/lc/fcc-lc.module';
import { HttpLoaderFactory, FccCommonModule } from '../fcc-common.module';
import { ResponseMessageComponent } from './components/response-message/response-message.component';
import { RetrieveCredentialsComponent } from './components/retrieve-credentials/retrieve-credentials.component';
import { FccRetrieveCredentialsRoutes } from './fcc-retrievecredential.routes';
import { RetrieveCredentialsService } from './services/retrieve-credentials.service';
import { RetrieveCredentialsMasterComponent } from './components/retrieve-credentials-master/retrieve-credentials-master.component';
import { ResponseMessageMasterComponent } from './components/response-message-master/response-message-master.component';
import { FccIrModule } from './../../corporate/trade/ir/fcc-ir.module';
import { FccUaModule } from './../../corporate/trade/ua/fcc-ua.module';
import { FormResolverModule } from './../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    RetrieveCredentialsComponent,
    ResponseMessageComponent,
    RetrieveCredentialsMasterComponent,
    ResponseMessageMasterComponent
    ],
  imports: [
    FccCommonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    RecaptchaModule,
    RecaptchaV3Module,
    RecaptchaFormsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatCheckboxModule,
    MessageModule,
    FccLcModule,
    FccElModule,
    FccIcModule,
    FccSgModule,
    FccIrModule,
    FccUaModule,
    ListboxModule,
    AutoCompleteModule,
    CommonModule,
    FormsModule,
    MenuModule,
    ReactiveFormsModule,
    SplitButtonModule,
    OverlayPanelModule,
    DropdownModule,
    DynamicDialogModule,
    MegaMenuModule,
    InputSwitchModule,
    MenubarModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    FccCommonRoutes,
    FccRetrieveCredentialsRoutes,
    HttpClientModule,
    CardModule,
    ToastModule,
    ProgressSpinnerModule,
    CarouselModule,
    ToolbarModule,
    TooltipModule,
    TableModule,
    SlideMenuModule,
    SidebarModule,
    TabMenuModule,
    RatingModule,
    BreadcrumbModule,
    CaptchaModule,
    ChartModule,
    DragDropModule,
    MultiSelectModule,
    DialogModule,
    TabViewModule,
    AccordionModule,
    SelectButtonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CookieModule.forRoot(),
    FileUploadModule,
    TableModule,
    FccLiModule,
    FormResolverModule,
    AngularEditorModule
    ],
  providers: [
    RetrieveCredentialsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccRetrievecredentialModule { }

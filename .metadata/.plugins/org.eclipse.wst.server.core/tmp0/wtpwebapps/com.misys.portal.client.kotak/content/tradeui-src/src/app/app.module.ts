import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { TabViewModule } from 'primeng/tabview';
import { AppComponent } from './app.component';
import { AppRouters } from './app.routes';
import { CommonModule } from './common/common.module';
import { PrimeNgModule } from './primeng.module';
import { SessionService } from './common/services/Session.Service';
import { TradeIUModule } from './trade/iu/trade.iu.module';
import { TradeRUModule } from './trade/ru/trade.ru.module';
import { BankModule } from './bank/bank.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeFr);
registerLocaleData(localeAr);

declare global {
    interface Navigator {
     msSaveOrOpenBlob: (blob: Blob,fileName?:any) => void
   }
 }

export function HttpLoaderFactory(http: HttpClient) {
  const LOCATION = 'location';
  const ORIGIN = 'origin';
  const CONTEXT_PATH = 'CONTEXT_PATH';
  const originURL = window[LOCATION][ORIGIN] + window[CONTEXT_PATH];
  return new MultiTranslateHttpLoader(http, [
      {prefix: `${originURL}/content/TRADEUI/assets/translate/core/`, suffix: '.json'}
  ]);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, AppRouters, HttpClientModule,
        ReactiveFormsModule, TradeIUModule, CommonModule, FormsModule, PrimeNgModule, TabViewModule, TradeRUModule,
        BankModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'x-xsrf-token'
        })
    ],
    providers: [
        SessionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

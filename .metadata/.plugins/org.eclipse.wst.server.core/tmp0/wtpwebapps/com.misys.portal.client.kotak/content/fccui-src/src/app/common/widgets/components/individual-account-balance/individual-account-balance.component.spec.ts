import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualAccountBalanceComponent } from './individual-account-balance.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

describe('IndividualAccountBalanceComponent', () => {
  let component: IndividualAccountBalanceComponent;
  let fixture: ComponentFixture<IndividualAccountBalanceComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     schemas: [NO_ERRORS_SCHEMA],
  //     imports: [BrowserAnimationsModule, RouterTestingModule.withRoutes([]),
  //       TranslateModule.forRoot(), HttpClientTestingModule, CardModule, TooltipModule, RouterModule],
  //     declarations: [IndividualAccountBalanceComponent],
  //     providers: [DialogService, TranslateService, GlobalDashboardComponent, MessageService]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualAccountBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('default title is : currencyWiseAccountBalance', () => {
    expect(component.title).toEqual('currencyWiseAccountBalance');
  });

  it('accountBalanceBasedOnCurrency is : []', () => {
    expect(component.accountBalanceBasedOnCurrency).toEqual([]);
  });

  it('call the ngonit of the component ', () => {
    spyOn(component, 'getProperties').and.callThrough();
    component.ngOnInit();
    expect(component.getProperties).toHaveBeenCalled();
  });

});

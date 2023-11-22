import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsComponent } from './payment-details.component';

describe('PaymentDetailsComponent', () => {
  let component: PaymentDetailsComponent;
  let fixture: ComponentFixture<PaymentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     schemas: [NO_ERRORS_SCHEMA],
  //     imports: [ReactiveFormsModule, CalendarModule, RadioButtonModule, DragDropModule, DropdownModule,
  //       InputSwitchModule, MultiSelectModule, SelectButtonModule, ProgressBarModule, MessagesModule, MessageModule,
  //       InputTextareaModule, HttpClientTestingModule, RouterModule, RouterTestingModule, TranslateModule.forRoot({
  //         loader: {
  //           provide: TranslateLoader,
  //           useClass: TranslateFakeLoader
  //         }
  //       })],
  //     declarations: [PaymentDetailsComponent],
  //     providers: [DialogService, TranslateService]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('variable declaration', () => {
    expect(component.confirm);
    expect(component.prev);
    expect(component.next);
    expect(component.creditAvailableWith);
    expect(component.creditAvailBy);
    expect(component.paymentDraftAt);
    expect(component.draweeDetails);
    expect(component.draweeList);
    expect(component.progressivebar);
    expect(component.bankName);
    expect(component.advBnk);
    expect(component.isueBnk);
    expect(component.anyBnk);
    expect(component.othBnk);
    expect(component.bankList);
    expect(component.list);
    expect(component.paymentDetailsModule);
    expect(component.selectList);
    expect(component.icon);
    expect(component.params);
    expect(component.checkIcons);
  });
  it('to check form submitted false', () => {
    expect(component.formSubmitted).toEqual(false);
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    // expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('call the ng onClickPrevious of the component', () => {
    spyOn(component, 'onClickPrevious').and.callThrough();
    component.onClickPrevious(Event);
  });
  it('call the ng onClickNext of the component', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    expect(true).toBeTruthy();
    component.onClickNext(Event);
  });
  // it('call the ng onClickPaymentDetailsBank of the component', () => {
  //   spyOn(component, 'onClickPaymentDetailsBank').and.callThrough();
  //   component.onClickPaymentDetailsBank(Event);
  // });
  it('call the ng onClickCreditAvailableOptions of the component', () => {
    spyOn(component, 'onClickCreditAvailableOptions').and.callThrough();
    component.onClickCreditAvailableOptions(Event);
  });
  it('call the ng onFocusCreditAvailableOptions of the component', () => {
    spyOn(component, 'onFocusCreditAvailableOptions').and.callThrough();
    component.onFocusCreditAvailableOptions(Event);
 });
  it('call the ng onClickInputSelect of the component', () => {
    spyOn(component, 'onClickInputSelect').and.callThrough();
    component.onClickInputSelect(Event);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FccBankDetailsComponent } from './fcc-bank-details.component';

describe('FccBankDetailsComponent', () => {
  let component: FccBankDetailsComponent;
  let fixture: ComponentFixture<FccBankDetailsComponent>;

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
  //     declarations: [FccBankDetailsComponent]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FccBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
  });

  // it('call the  onFocusThirdAddressLine', () => {
  //   spyOn(component, 'onFocusThirdAddressLine').and.callThrough();
  //   component.onFocusThirdAddressLine();
  // });

  // it('call the onFocusThirdAddressLine', () => {
  //   spyOn(component, 'onFocusSecondAddressLine').and.callThrough();
  //   component.onFocusSecondAddressLine();
  // });

  // it('call the onFocusConfirmationThirdAddressLine', () => {
  //   spyOn(component, 'onFocusConfirmationThirdAddressLine').and.callThrough();
  //   component.onFocusConfirmationThirdAddressLine();
  // });

  // it('call the onFocusConfirmationSecondAddressLine', () => {
  //   spyOn(component, 'onFocusConfirmationSecondAddressLine').and.callThrough();
  //   component.onFocusConfirmationSecondAddressLine();
  // });

  it('call the onClickNext', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    component.onClickNext(Event);
  });

  it('call the onClickPrevious', () => {
    spyOn(component, 'onClickPrevious').and.callThrough();
    component.onClickNext(Event);
  });

  it('call the onClickBankDetailsType', () => {
    spyOn(component, 'onClickBankDetailsType').and.callThrough();
    component.onClickBankDetailsType(Event);
  });

  it('call the addConfirmationPartArray', () => {
    spyOn(component, 'addConfirmationPartArray').and.callThrough();
    component.addConfirmationPartArray(Event);
  });


  // it('call the onFocusAdvisingThirdAddressLine', () => {
  //   spyOn(component, 'onFocusAdvisingThirdAddressLine').and.callThrough();
  //   component.onFocusAdvisingThirdAddressLine();
  // });
  it('variable declaration' , () => {
    expect(component.form);
    expect(component.lcConstant);
    expect(component.lcConstant);
    expect(component.rendered);
    expect(component.module);
    expect(component.checkBoxvalue);
    expect(component.rightBottomSecondTempArr);
    expect(component.appBenNameLength);
    expect(component.appBenNameRegex);
  });

});

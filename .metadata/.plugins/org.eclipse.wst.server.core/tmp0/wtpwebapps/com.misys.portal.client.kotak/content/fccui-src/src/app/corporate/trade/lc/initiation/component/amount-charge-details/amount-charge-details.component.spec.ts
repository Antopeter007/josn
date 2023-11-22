import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountChargeDetailsComponent } from './amount-charge-details.component';

describe('AmountChargeDetailsComponent', () => {
  let component: AmountChargeDetailsComponent;
  let fixture: ComponentFixture<AmountChargeDetailsComponent>;

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
  //     declarations: [AmountChargeDetailsComponent],
  //     providers: [DialogService, TranslateService]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountChargeDetailsComponent);
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
    expect(component.selectedValue);
    expect(component.flagDecimalPlaces);
    expect(component.isoamt);
    expect(component.params);
    expect(component.render);
    // expect(component.progressivebar);
    expect(component.OMR);
    expect(component.BHD);
    expect(component.TND);
    expect(component.JPY);
    expect(component.xchRequest);
    expect(component.revolveFrequencyOptions);
  });

  it('to check form submitted false', () => {
    expect(component.formSubmitted).toEqual(false);
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    // expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('call the ng onClickPrev of the component', () => {
    spyOn(component, 'onClickPrevious').and.callThrough();
    component.onClickPrevious(Event);
  });
  it('call the ng onClickNext of the component', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    expect(component.form.valid).toBeTruthy();
    component.onClickNext(Event);
  });
  // it('call the ng onClickCcy of the component', () => {
  //   spyOn(component, 'onClickCurrency').and.callThrough();
  //   component.onClickCurrency(Event); //, Key);
  // });
  it('call the ng onBlurAmt of the component', () => {
    spyOn(component, 'onBlurAmount').and.callThrough();
    component.onBlurAmount();
  });


});

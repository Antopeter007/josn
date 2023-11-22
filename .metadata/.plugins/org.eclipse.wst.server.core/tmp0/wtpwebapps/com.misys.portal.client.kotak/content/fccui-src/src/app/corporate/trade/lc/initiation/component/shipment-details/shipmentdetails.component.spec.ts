import { ShipmentdetailsComponent } from './shipmentdetails.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ShipmentdetailsComponent', () => {
  let component: ShipmentdetailsComponent;
  let fixture: ComponentFixture<ShipmentdetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     schemas: [NO_ERRORS_SCHEMA],
  //     imports:  [ ReactiveFormsModule, CalendarModule, RadioButtonModule, DragDropModule, DropdownModule,
  //           InputSwitchModule, MultiSelectModule, SelectButtonModule, ProgressBarModule, MessagesModule, MessageModule,
  //           InputTextareaModule, HttpClientTestingModule, RouterModule, RouterTestingModule, TranslateModule.forRoot({
  //             loader: {
  //               provide: TranslateLoader,
  //               useClass: TranslateFakeLoader
  //             }
  //     })],
  //     declarations: [ ShipmentdetailsComponent ],
  //     providers: [DialogService, TranslateService ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('variable declaration' , () => {
    expect(component.module);
    expect(component.shipmentForm);
    expect(component.shipmentTo);
    expect(component.placeOfLoading);
    expect(component.placeOfDischarge);
    expect(component.lastShipmentDate);
    expect(component.params);
    expect(component.shipmentPeriod);
    // expect(component.progressivebar);
    expect(component.partialshipment);
    expect(component.transhipment);
    expect(component.purchaseTerms);
    expect(component.namedPlace);
    expect(component.exwork);
    expect(component.freecarrier);
    expect(component.freealong);
    expect(component.freeboard);
    expect(component.costandfreight);
    expect(component.costinfreight);
    expect(component.deleverdterminal);
    expect(component.deleverdplace);
    expect(component.carriagepaid);
    expect(component.carriageinsurance);
    expect(component.deleverdpaid);
    expect(component.allowed);
    expect(component.conditional);
    expect(component.notallowed);
    expect(component.warning);
  });

  // it('to check form submitted false', () => {
  // expect(component.formSubmitted).toEqual(false);
  // });

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
    component.onClickNext(Event);
      });
  it('call the ng onClickPartialshipmentvalue of the component', () => {
    spyOn(component, 'onClickPartialshipmentvalue').and.callThrough();
    component.onClickPartialshipmentvalue(Event);
      });
  it('call the ng onClickTranshipmentvalue of the component', () => {
    spyOn(component, 'onClickTranshipmentvalue').and.callThrough();
    component.onClickTranshipmentvalue(Event);
      });

  it('call the ng onClickPurchaseTermsValue of the component', () => {
        spyOn(component, 'onClickPurchaseTermsValue').and.callThrough();
        component.onClickPurchaseTermsValue(Event);
          });

});

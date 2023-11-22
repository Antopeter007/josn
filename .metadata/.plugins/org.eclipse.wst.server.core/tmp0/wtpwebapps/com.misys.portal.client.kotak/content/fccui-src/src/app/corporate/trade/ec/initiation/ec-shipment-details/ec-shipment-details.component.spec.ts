import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcShipmentDetailsComponent } from './ec-shipment-details.component';

describe('EcShipmentDetailsComponent', () => {
  let component: EcShipmentDetailsComponent;
  let fixture: ComponentFixture<EcShipmentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcShipmentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ng onClickIncoTerms of the component', () => {
    spyOn(component, 'onClickIncoTerms').and.callThrough();
    component.onClickIncoTerms(Event);
  });

});

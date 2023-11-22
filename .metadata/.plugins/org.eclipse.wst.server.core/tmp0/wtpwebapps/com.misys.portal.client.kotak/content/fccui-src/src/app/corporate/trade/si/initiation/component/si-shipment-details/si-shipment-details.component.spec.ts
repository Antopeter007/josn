import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiShipmentDetailsComponent } from './si-shipment-details.component';

describe('SiShipmentDetailsComponent', () => {
  let component: SiShipmentDetailsComponent;
  let fixture: ComponentFixture<SiShipmentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiShipmentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

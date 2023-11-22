import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentNarrativeComponent } from './shipment-narrative.component';

describe('ShipmentNarrativeComponent', () => {
  let component: ShipmentNarrativeComponent;
  let fixture: ComponentFixture<ShipmentNarrativeComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ShipmentNarrativeComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentNarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

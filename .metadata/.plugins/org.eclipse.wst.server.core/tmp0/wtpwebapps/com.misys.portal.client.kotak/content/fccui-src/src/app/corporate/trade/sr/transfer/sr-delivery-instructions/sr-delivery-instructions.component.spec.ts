import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrDeliveryInstructionsComponent } from './sr-delivery-instructions.component';

describe('SrDeliveryInstructionsComponent', () => {
  let component: SrDeliveryInstructionsComponent;
  let fixture: ComponentFixture<SrDeliveryInstructionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrDeliveryInstructionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrDeliveryInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

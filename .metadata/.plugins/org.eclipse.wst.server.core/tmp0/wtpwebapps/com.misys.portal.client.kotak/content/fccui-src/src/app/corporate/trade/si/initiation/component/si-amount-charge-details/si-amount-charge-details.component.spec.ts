import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiAmountChargeDetailsComponent } from './si-amount-charge-details.component';

describe('SiAmountChargeDetailsComponent', () => {
  let component: SiAmountChargeDetailsComponent;
  let fixture: ComponentFixture<SiAmountChargeDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiAmountChargeDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiAmountChargeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

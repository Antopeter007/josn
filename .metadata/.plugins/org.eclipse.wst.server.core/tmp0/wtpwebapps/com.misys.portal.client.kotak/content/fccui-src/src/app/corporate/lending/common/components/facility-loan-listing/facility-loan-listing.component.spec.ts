import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityLoanListingComponent } from './facility-loan-listing.component';

describe('FacilityLoanListingComponent', () => {
  let component: FacilityLoanListingComponent;
  let fixture: ComponentFixture<FacilityLoanListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityLoanListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityLoanListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

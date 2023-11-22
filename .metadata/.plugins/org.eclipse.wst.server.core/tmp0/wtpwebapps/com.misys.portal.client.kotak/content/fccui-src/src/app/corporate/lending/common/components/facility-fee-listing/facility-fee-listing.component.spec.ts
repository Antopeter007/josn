import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityFeeListingComponent } from './facility-fee-listing.component';

describe('FacilityFeeListingComponent', () => {
  let component: FacilityFeeListingComponent;
  let fixture: ComponentFixture<FacilityFeeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityFeeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFeeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

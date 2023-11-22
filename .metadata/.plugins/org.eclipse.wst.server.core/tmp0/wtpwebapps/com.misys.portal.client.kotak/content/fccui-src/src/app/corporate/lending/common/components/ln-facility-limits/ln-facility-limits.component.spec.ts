import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnFacilityLimitsComponent } from './ln-facility-limits.component';

describe('LnFacilityLimitsComponent', () => {
  let component: LnFacilityLimitsComponent;
  let fixture: ComponentFixture<LnFacilityLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LnFacilityLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LnFacilityLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

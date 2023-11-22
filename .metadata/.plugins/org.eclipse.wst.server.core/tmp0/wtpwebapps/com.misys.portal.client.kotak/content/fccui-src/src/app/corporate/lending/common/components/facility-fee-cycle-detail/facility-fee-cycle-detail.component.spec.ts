import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityFeeCycleDetailComponent } from './facility-fee-cycle-detail.component';

describe('FacilityFeeCycleDetailComponent', () => {
  let component: FacilityFeeCycleDetailComponent;
  let fixture: ComponentFixture<FacilityFeeCycleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityFeeCycleDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFeeCycleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

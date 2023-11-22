import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendComparisonViewComponent } from './amend-comparison-view.component';

describe('AmendComparisonViewComponent', () => {
  let component: AmendComparisonViewComponent;
  let fixture: ComponentFixture<AmendComparisonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendComparisonViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendComparisonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendComparisonDialogComponent } from './amend-comparison-dialog.component';

describe('AmendComparisonDialogComponent', () => {
  let component: AmendComparisonDialogComponent;
  let fixture: ComponentFixture<AmendComparisonDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AmendComparisonDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendComparisonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

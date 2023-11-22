import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcSummaryComponent } from './lc-summary.component';

describe('LcSummaryComponent', () => {
  let component: LcSummaryComponent;
  let fixture: ComponentFixture<LcSummaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcSummaryComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfRepaymentGeneralDetailsComponent } from './tf-repayment-general-details.component';

describe('TfRepaymentGeneralDetailsComponent', () => {
  let component: TfRepaymentGeneralDetailsComponent;
  let fixture: ComponentFixture<TfRepaymentGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfRepaymentGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfRepaymentGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

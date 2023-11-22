import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfRepaymentAttachmentDetailsComponent } from './tf-repayment-attachment-details.component';

describe('TfRepaymentAttachmentDetailsComponent', () => {
  let component: TfRepaymentAttachmentDetailsComponent;
  let fixture: ComponentFixture<TfRepaymentAttachmentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfRepaymentAttachmentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfRepaymentAttachmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InquiryPendingTnxComponent } from './inquiry-pending-tnx.component';

describe('InquiryPendingTnxComponent', () => {
  let component: InquiryPendingTnxComponent;
  let fixture: ComponentFixture<InquiryPendingTnxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiryPendingTnxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryPendingTnxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

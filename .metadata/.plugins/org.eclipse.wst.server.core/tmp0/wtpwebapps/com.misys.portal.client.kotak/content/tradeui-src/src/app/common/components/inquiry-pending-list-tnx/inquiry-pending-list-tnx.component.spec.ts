import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InquiryPendingListTnxComponent } from './inquiry-pending-list-tnx.component';

describe('InquiryLcListdefComponent', () => {
  let component: InquiryPendingListTnxComponent;
  let fixture: ComponentFixture<InquiryPendingListTnxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiryPendingListTnxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryPendingListTnxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

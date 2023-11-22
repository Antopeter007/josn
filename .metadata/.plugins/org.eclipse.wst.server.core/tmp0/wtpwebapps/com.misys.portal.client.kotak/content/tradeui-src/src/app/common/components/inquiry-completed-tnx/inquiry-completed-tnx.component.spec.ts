import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InquiryCompletedTnxComponent } from './inquiry-completed-tnx.component';

describe('InquiryCompletedTnxComponent', () => {
  let component: InquiryCompletedTnxComponent;
  let fixture: ComponentFixture<InquiryCompletedTnxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiryCompletedTnxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryCompletedTnxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

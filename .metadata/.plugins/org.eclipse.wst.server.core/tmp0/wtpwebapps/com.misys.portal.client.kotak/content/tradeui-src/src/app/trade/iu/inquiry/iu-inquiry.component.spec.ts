import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IuInquiryComponent } from './iu-inquiry.component';

describe('IuInquiryComponent', () => {
  let component: IuInquiryComponent;
  let fixture: ComponentFixture<IuInquiryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IuInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IuInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

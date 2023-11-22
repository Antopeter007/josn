import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUInquiryPreviewComponent } from './iu-inquiry-preview.component';

describe('IuInquiryPreviewComponent', () => {
  let component: IUInquiryPreviewComponent;
  let fixture: ComponentFixture<IUInquiryPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUInquiryPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUInquiryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

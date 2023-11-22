import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonRenewalDetailsComponent } from './common-renewal-details.component';

describe('CommonRenewalDetailsComponent', () => {
  let component: CommonRenewalDetailsComponent;
  let fixture: ComponentFixture<CommonRenewalDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonRenewalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRenewalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonBankDetailsComponent } from './common-bank-details.component';

describe('CommonBankDetailsComponent', () => {
  let component: CommonBankDetailsComponent;
  let fixture: ComponentFixture<CommonBankDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

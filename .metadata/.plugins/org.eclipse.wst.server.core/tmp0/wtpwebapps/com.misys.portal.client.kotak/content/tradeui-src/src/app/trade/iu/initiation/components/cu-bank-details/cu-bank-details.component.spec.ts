import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuBankDetailsComponent } from './cu-bank-details.component';

describe('CuBankDetailsComponent', () => {
  let component: CuBankDetailsComponent;
  let fixture: ComponentFixture<CuBankDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

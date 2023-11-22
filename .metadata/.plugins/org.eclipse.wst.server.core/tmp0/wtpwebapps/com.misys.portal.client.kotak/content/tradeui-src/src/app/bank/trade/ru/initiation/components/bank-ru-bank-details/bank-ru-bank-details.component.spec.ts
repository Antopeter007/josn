import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankRuBankDetailsComponent } from './bank-ru-bank-details.component';

describe('BankRuBankDetailsComponent', () => {
  let component: BankRuBankDetailsComponent;
  let fixture: ComponentFixture<BankRuBankDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankRuBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankRuBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

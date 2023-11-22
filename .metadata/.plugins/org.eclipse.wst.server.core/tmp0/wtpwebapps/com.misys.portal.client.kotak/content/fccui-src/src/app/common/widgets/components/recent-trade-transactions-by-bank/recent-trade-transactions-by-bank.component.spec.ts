import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTradeTransactionsByBankComponent } from './recent-trade-transactions-by-bank.component';

describe('RecentTradeTransactionsByBankComponent', () => {
  let component: RecentTradeTransactionsByBankComponent;
  let fixture: ComponentFixture<RecentTradeTransactionsByBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentTradeTransactionsByBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentTradeTransactionsByBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceSummaryComponent } from './account-balance-summary.component';

describe('AccountBalanceSummaryComponent', () => {
  let component: AccountBalanceSummaryComponent;
  let fixture: ComponentFixture<AccountBalanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBalanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

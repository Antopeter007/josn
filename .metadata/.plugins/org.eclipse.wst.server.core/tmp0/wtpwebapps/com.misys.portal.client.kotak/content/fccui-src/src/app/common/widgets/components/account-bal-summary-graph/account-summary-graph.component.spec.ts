import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummaryGraphComponent } from './account-summary-graph.component';

describe('AccountSummaryGraphComponent', () => {
  let component: AccountSummaryGraphComponent;
  let fixture: ComponentFixture<AccountSummaryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSummaryGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummaryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

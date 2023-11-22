import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCounterpartyBankDialogComponent } from './add-counterparty-bank-dialog.component';

describe('AddCounterpartyBankDialogComponent', () => {
  let component: AddCounterpartyBankDialogComponent;
  let fixture: ComponentFixture<AddCounterpartyBankDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCounterpartyBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCounterpartyBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

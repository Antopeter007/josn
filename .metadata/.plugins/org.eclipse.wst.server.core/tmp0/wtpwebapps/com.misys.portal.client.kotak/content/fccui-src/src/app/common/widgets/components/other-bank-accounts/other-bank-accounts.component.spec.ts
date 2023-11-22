import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherBankAccountsComponent } from './other-bank-accounts.component';

describe('OtherBankAccountsComponent', () => {
  let component: OtherBankAccountsComponent;
  let fixture: ComponentFixture<OtherBankAccountsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ OtherBankAccountsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

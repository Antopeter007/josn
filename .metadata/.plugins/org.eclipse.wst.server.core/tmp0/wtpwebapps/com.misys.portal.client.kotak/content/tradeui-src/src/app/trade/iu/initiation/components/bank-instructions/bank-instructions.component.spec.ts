import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankInstructionsComponent } from './bank-instructions.component';

describe('BankInstructionsComponent', () => {
  let component: BankInstructionsComponent;
  let fixture: ComponentFixture<BankInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

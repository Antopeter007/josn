import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonBankInstructionsComponent } from './common-bank-instructions.component';

describe('CommonBankInstructionsComponent', () => {
  let component: CommonBankInstructionsComponent;
  let fixture: ComponentFixture<CommonBankInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonBankInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBankInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

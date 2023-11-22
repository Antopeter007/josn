import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuingBankComponent } from './issuing-bank.component';

describe('IssuingBankComponent', () => {
  let component: IssuingBankComponent;
  let fixture: ComponentFixture<IssuingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IssuingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

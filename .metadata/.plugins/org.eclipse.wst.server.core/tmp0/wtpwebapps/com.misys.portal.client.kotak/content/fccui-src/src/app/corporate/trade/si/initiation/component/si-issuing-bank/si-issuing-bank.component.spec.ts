import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiIssuingBankComponent } from './si-issuing-bank.component';

describe('SiIssuingBankComponent', () => {
  let component: SiIssuingBankComponent;
  let fixture: ComponentFixture<SiIssuingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiIssuingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiIssuingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

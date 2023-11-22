import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcRemittingBankComponent } from './ec-remitting-bank.component';

describe('EcRemittingBankComponent', () => {
  let component: EcRemittingBankComponent;
  let fixture: ComponentFixture<EcRemittingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcRemittingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcRemittingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

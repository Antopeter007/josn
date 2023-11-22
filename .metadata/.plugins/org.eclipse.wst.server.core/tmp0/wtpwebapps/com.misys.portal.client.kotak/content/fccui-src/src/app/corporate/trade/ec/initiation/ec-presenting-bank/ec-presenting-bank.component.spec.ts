import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcPresentingBankComponent } from './ec-presenting-bank.component';

describe('EcPresentingBankComponent', () => {
  let component: EcPresentingBankComponent;
  let fixture: ComponentFixture<EcPresentingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcPresentingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcPresentingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

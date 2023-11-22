import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcBankDetailsComponent } from './ec-bank-details.component';

describe('EcBankDetailsComponent', () => {
  let component: EcBankDetailsComponent;
  let fixture: ComponentFixture<EcBankDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcBankDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

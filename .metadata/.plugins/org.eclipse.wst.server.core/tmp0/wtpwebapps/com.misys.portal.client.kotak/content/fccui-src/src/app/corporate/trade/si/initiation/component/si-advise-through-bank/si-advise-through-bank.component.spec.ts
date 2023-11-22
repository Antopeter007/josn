import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiAdviseThroughBankComponent } from './si-advise-through-bank.component';

describe('SiAdviseThroughBankComponent', () => {
  let component: SiAdviseThroughBankComponent;
  let fixture: ComponentFixture<SiAdviseThroughBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiAdviseThroughBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiAdviseThroughBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviseThroughBankComponent } from './advise-through-bank.component';

describe('AdviseThroughBankComponent', () => {
  let component: AdviseThroughBankComponent;
  let fixture: ComponentFixture<AdviseThroughBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AdviseThroughBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviseThroughBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisingBankComponent } from './advising-bank.component';

describe('AdvisingBankComponent', () => {
  let component: AdvisingBankComponent;
  let fixture: ComponentFixture<AdvisingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AdvisingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

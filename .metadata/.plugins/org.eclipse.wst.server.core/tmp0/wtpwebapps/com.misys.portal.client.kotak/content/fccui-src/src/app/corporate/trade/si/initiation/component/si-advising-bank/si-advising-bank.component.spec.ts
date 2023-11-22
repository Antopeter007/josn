import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiAdvisingBankComponent } from './si-advising-bank.component';

describe('SiAdvisingBankComponent', () => {
  let component: SiAdvisingBankComponent;
  let fixture: ComponentFixture<SiAdvisingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiAdvisingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiAdvisingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

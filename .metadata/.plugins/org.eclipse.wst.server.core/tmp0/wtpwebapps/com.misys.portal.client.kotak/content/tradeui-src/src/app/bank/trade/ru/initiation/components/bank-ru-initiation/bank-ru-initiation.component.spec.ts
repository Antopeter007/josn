import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankRuInitiationComponent } from './bank-ru-initiation.component';

describe('BankRuInitiationComponent', () => {
  let component: BankRuInitiationComponent;
  let fixture: ComponentFixture<BankRuInitiationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankRuInitiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankRuInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

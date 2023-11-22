import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankRuGeneralDetailsComponent } from './bank-ru-general-details.component';

describe('BankRuGeneralDetailsComponent', () => {
  let component: BankRuGeneralDetailsComponent;
  let fixture: ComponentFixture<BankRuGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankRuGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankRuGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

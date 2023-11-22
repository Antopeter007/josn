import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLocalAdviseThroughBankComponent } from './ui-local-advise-through-bank.component';

describe('UiLocalAdviseThroughBankComponent', () => {
  let component: UiLocalAdviseThroughBankComponent;
  let fixture: ComponentFixture<UiLocalAdviseThroughBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiLocalAdviseThroughBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiLocalAdviseThroughBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

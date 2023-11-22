import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanIncreaseComponent } from './loan-increase.component';

describe('LoanIncreaseComponent', () => {
  let component: LoanIncreaseComponent;
  let fixture: ComponentFixture<LoanIncreaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanIncreaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

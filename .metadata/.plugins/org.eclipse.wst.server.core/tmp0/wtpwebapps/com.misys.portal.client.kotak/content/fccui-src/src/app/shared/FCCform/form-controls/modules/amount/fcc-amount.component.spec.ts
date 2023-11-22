import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCCAmountComponent } from './fcc-amount.component';

describe('FCCAmountComponent', () => {
  let component: FCCAmountComponent;
  let fixture: ComponentFixture<FCCAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCCAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCCAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesAndChargesComponent } from './fees-and-charges.component';

describe('FeesAndChargesComponent', () => {
  let component: FeesAndChargesComponent;
  let fixture: ComponentFixture<FeesAndChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeesAndChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesAndChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

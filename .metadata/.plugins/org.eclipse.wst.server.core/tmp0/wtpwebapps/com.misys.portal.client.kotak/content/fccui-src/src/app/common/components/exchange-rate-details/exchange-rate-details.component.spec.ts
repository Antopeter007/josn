import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateDetailsComponent } from './exchange-rate-details.component';

describe('ExchangeRateDetailsComponent', () => {
  let component: ExchangeRateDetailsComponent;
  let fixture: ComponentFixture<ExchangeRateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

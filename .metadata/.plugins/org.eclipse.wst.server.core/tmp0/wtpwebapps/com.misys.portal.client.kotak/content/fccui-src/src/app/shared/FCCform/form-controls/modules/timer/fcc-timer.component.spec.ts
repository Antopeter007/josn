import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCCTimerComponent } from './fcc-timer.component';

describe('FCCTimerComponent', () => {
  let component: FCCTimerComponent;
  let fixture: ComponentFixture<FCCTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCCTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCCTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

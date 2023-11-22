import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HRTAGComponent } from './hrtag.component';

describe('HRTAGComponent', () => {
  let component: HRTAGComponent;
  let fixture: ComponentFixture<HRTAGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HRTAGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HRTAGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

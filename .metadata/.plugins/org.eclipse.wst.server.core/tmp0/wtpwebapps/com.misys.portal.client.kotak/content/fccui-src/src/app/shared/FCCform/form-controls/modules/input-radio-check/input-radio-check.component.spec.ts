import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRadioCheckComponent } from './input-radio-check.component';

describe('InputRadioCheckComponent', () => {
  let component: InputRadioCheckComponent;
  let fixture: ComponentFixture<InputRadioCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputRadioCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRadioCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

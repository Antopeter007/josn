import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCCCheckboxComponent } from './fcc-checkbox.component';

describe('FCCCheckboxComponent', () => {
  let component: FCCCheckboxComponent;
  let fixture: ComponentFixture<FCCCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCCCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCCCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

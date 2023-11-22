import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCCInputTextComponent } from './fcc-input-text.component';

describe('FCCInputTextComponent', () => {
  let component: FCCInputTextComponent;
  let fixture: ComponentFixture<FCCInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCCInputTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCCInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

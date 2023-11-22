import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCbComponent } from './input-cb.component';

describe('InputCbComponent', () => {
  let component: InputCbComponent;
  let fixture: ComponentFixture<InputCbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

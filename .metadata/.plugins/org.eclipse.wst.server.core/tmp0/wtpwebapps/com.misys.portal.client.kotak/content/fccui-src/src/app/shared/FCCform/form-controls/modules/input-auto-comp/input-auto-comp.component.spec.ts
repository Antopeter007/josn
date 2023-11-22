import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutoCompComponent } from './input-auto-comp.component';

describe('InputAutoCompComponent', () => {
  let component: InputAutoCompComponent;
  let fixture: ComponentFixture<InputAutoCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputAutoCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAutoCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

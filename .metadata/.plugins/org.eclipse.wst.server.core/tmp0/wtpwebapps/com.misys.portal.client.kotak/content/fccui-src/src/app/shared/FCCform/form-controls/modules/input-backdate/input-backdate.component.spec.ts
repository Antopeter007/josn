import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBackdateComponent } from './input-backdate.component';

describe('InputBackdateComponent', () => {
  let component: InputBackdateComponent;
  let fixture: ComponentFixture<InputBackdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputBackdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBackdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

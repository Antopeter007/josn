import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRendrerComponent } from './form-rendrer.component';

describe('FormRendrerComponent', () => {
  let component: FormRendrerComponent;
  let fixture: ComponentFixture<FormRendrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRendrerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRendrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

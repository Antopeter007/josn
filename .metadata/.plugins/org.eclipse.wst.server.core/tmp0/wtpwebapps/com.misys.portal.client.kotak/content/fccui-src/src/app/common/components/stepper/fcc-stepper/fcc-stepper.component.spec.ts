import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccStepperComponent } from './fcc-stepper.component';

describe('FccStepperComponent', () => {
  let component: FccStepperComponent;
  let fixture: ComponentFixture<FccStepperComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FccStepperComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FccStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

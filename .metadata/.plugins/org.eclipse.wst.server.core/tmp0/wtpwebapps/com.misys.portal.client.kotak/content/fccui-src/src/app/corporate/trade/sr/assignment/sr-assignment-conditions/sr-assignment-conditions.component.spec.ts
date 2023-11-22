import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrAssignmentConditionsComponent } from './sr-assignment-conditions.component';

describe('SrAssignmentConditionsComponent', () => {
  let component: SrAssignmentConditionsComponent;
  let fixture: ComponentFixture<SrAssignmentConditionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrAssignmentConditionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrAssignmentConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetReferenceComponent } from './set-reference.component';

describe('SetReferenceComponent', () => {
  let component: SetReferenceComponent;
  let fixture: ComponentFixture<SetReferenceComponent>;

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ SetReferenceComponent ]
  //   })
  //   .compileComponents();
  // });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

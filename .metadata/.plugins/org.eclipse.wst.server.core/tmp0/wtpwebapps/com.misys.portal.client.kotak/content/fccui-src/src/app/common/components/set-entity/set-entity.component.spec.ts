import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEntityComponent } from './set-entity.component';

describe('SetEntityComponent', () => {
  let component: SetEntityComponent;
  let fixture: ComponentFixture<SetEntityComponent>;

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ SetEntityComponent ]
  //   })
  //   .compileComponents();
  // });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetReferenceSidenavComponent } from './set-reference-sidenav.component';

describe('SetReferenceSidenavComponent', () => {
  let component: SetReferenceSidenavComponent;
  let fixture: ComponentFixture<SetReferenceSidenavComponent>;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SetReferenceSidenavComponent ]
  //   })
  //   .compileComponents();
  // });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetReferenceSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

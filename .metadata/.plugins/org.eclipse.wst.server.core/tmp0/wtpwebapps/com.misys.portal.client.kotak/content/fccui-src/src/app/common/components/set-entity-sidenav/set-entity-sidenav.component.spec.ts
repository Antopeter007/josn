import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEntitySidenavComponent } from './set-entity-sidenav.component';

describe('SetEntitySidenavComponent', () => {
  let component: SetEntitySidenavComponent;
  let fixture: ComponentFixture<SetEntitySidenavComponent>;

  // beforeEach(async(() => {
  //  TestBed.configureTestingModule({
  //    declarations: [ SetEntitySidenavComponent ]
  //  })
  //  .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetEntitySidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

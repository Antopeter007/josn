import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerDraweeComponent } from './drawer-drawee.component';

describe('DrawerDraweeComponent', () => {
  let component: DrawerDraweeComponent;
  let fixture: ComponentFixture<DrawerDraweeComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DrawerDraweeComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerDraweeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

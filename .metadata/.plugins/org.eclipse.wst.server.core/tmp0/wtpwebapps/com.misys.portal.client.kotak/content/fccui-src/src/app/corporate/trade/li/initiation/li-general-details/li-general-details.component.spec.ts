import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiGeneralDetailsComponent } from './li-general-details.component';

describe('LiGeneralDetailsComponent', () => {
  let component: LiGeneralDetailsComponent;
  let fixture: ComponentFixture<LiGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

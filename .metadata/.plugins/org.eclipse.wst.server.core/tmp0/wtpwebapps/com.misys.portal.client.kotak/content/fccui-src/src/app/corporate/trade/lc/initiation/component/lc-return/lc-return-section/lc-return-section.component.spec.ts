import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcReturnSectionComponent } from './lc-return-section.component';

describe('LcReturnSectionComponent', () => {
  let component: LcReturnSectionComponent;
  let fixture: ComponentFixture<LcReturnSectionComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcReturnSectionComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcReturnSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

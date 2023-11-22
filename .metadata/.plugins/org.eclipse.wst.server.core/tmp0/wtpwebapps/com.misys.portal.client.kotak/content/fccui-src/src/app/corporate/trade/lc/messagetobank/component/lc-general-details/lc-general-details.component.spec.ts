import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcGeneralDetailsComponent } from './lc-general-details.component';

describe('LcGeneralDetailsComponent', () => {
  let component: LcGeneralDetailsComponent;
  let fixture: ComponentFixture<LcGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

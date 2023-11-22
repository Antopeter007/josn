import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LCTabSectionComponent } from './tab-section.component';

describe('LCTabSectionComponent', () => {
  let component: LCTabSectionComponent;
  let fixture: ComponentFixture<LCTabSectionComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LCTabSectionComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCTabSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

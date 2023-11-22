import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcListingComponent } from './lc-listing.component';

describe('LcListingComponent', () => {
  let component: LcListingComponent;
  let fixture: ComponentFixture<LcListingComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcListingComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

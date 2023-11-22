import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbTrackingComponent } from './awb-tracking.component';

describe('AwbTrackingComponent', () => {
  let component: AwbTrackingComponent;
  let fixture: ComponentFixture<AwbTrackingComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AwbTrackingComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

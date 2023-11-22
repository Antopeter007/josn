import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewHeaderComponent } from './review-header.component';

describe('ReviewHeaderComponent', () => {
  let component: ReviewHeaderComponent;
  let fixture: ComponentFixture<ReviewHeaderComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewHeaderComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

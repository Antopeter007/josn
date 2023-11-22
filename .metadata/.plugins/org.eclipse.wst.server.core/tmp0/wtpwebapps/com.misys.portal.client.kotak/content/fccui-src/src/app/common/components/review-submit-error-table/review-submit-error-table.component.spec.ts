import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitErrorTableComponent } from './review-submit-error-table.component';

describe('ReviewSubmitErrorTableComponent', () => {
  let component: ReviewSubmitErrorTableComponent;
  let fixture: ComponentFixture<ReviewSubmitErrorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSubmitErrorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitErrorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

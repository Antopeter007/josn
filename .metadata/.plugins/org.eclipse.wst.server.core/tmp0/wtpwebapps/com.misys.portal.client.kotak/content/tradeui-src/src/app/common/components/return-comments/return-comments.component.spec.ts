import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReturnCommentsComponent } from './return-comments.component';

describe('ReturnCommentsComponent', () => {
  let component: ReturnCommentsComponent;
  let fixture: ComponentFixture<ReturnCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

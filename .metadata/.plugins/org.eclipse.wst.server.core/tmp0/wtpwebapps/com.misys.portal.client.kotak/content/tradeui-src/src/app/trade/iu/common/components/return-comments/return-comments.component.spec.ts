import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUCommonReturnCommentsComponent } from './return-comments.component';

describe('ReturnCommentsComponent', () => {
  let component: IUCommonReturnCommentsComponent;
  let fixture: ComponentFixture<IUCommonReturnCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUCommonReturnCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUCommonReturnCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

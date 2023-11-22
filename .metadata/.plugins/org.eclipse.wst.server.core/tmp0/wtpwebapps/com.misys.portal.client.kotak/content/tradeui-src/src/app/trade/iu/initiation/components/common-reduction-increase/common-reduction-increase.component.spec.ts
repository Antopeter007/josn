import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonReductionIncreaseComponent } from './common-reduction-increase.component';

describe('CommonReductionIncreaseComponent', () => {
  let component: CommonReductionIncreaseComponent;
  let fixture: ComponentFixture<CommonReductionIncreaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonReductionIncreaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonReductionIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReductionIncreaseComponent } from './reduction-increase.component';

describe('ReductionIncreaseComponent', () => {
  let component: ReductionIncreaseComponent;
  let fixture: ComponentFixture<ReductionIncreaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReductionIncreaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReductionIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

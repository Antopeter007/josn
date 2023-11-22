import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuReductionIncreaseComponent } from './cu-reduction-increase.component';

describe('CuReductionIncreaseComponent', () => {
  let component: CuReductionIncreaseComponent;
  let fixture: ComponentFixture<CuReductionIncreaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuReductionIncreaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuReductionIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

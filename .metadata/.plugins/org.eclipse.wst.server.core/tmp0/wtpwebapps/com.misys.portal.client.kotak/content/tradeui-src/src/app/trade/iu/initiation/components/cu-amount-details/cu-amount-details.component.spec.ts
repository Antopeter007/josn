import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuAmountDetailsComponent } from './cu-amount-details.component';

describe('CuAmountDetailsComponent', () => {
  let component: CuAmountDetailsComponent;
  let fixture: ComponentFixture<CuAmountDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuAmountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

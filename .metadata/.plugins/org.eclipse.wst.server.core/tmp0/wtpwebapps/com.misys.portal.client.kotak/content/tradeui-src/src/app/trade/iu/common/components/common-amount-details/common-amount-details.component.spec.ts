import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonAmountDetailsComponent } from './common-amount-details.component';

describe('CommonAmountDetailsComponent', () => {
  let component: CommonAmountDetailsComponent;
  let fixture: ComponentFixture<CommonAmountDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAmountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


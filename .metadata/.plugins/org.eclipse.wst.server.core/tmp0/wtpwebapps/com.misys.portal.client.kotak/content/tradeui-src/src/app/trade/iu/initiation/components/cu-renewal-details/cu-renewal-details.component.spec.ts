import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuRenewalDetailsComponent } from './cu-renewal-details.component';

describe('CuRenewalDetailsComponent', () => {
  let component: CuRenewalDetailsComponent;
  let fixture: ComponentFixture<CuRenewalDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuRenewalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuRenewalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

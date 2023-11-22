import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LnProductComponent } from './ln-product.component';

describe('LnProductComponent', () => {
  let component: LnProductComponent;
  let fixture: ComponentFixture<LnProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LnProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LnProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

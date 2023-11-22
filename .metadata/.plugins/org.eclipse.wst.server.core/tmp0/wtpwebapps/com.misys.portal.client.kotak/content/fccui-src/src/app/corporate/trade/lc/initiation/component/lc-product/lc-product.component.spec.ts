import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcProductComponent } from './lc-product.component';

describe('LcProductComponent', () => {
  let component: LcProductComponent;
  let fixture: ComponentFixture<LcProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

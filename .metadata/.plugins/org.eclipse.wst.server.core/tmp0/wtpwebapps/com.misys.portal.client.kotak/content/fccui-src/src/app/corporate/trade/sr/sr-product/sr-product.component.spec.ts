import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrProductComponent } from './sr-product.component';

describe('SrProductComponent', () => {
  let component: SrProductComponent;
  let fixture: ComponentFixture<SrProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgProductComponent } from './sg-product.component';

describe('SgProductComponent', () => {
  let component: SgProductComponent;
  let fixture: ComponentFixture<SgProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

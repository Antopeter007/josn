import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfProductComponent } from './tf-product.component';

describe('TfProductComponent', () => {
  let component: TfProductComponent;
  let fixture: ComponentFixture<TfProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

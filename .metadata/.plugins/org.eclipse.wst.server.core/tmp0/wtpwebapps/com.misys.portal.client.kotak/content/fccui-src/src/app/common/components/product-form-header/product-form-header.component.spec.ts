import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormHeaderComponent } from './product-form-header.component';

describe('ProductFormHeaderComponent', () => {
  let component: ProductFormHeaderComponent;
  let fixture: ComponentFixture<ProductFormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFormHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

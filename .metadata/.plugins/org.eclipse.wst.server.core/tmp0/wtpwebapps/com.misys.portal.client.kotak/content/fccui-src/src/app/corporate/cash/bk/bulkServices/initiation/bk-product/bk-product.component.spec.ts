import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BkProductComponent } from './bk-product.component';

describe('BkProductComponent', () => {
  let component: BkProductComponent;
  let fixture: ComponentFixture<BkProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BkProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BkProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

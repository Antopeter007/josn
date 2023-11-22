import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderViewPreviewComponent } from './purchase-order-view-preview.component';

describe('PurchaseOrderViewPreviewComponent', () => {
  let component: PurchaseOrderViewPreviewComponent;
  let fixture: ComponentFixture<PurchaseOrderViewPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderViewPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderViewPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

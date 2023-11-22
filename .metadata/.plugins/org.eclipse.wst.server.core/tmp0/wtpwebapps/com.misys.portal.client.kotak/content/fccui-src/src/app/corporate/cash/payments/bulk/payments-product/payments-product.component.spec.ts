import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsProductComponent } from './payments-product.component';

describe('PaymentsProductComponent', () => {
  let component: PaymentsProductComponent;
  let fixture: ComponentFixture<PaymentsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsProductComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

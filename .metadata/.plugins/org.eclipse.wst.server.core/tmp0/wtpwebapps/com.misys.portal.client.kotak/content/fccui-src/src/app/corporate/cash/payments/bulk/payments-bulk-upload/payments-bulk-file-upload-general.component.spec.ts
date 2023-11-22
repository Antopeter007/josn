import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsBulkFileUploadGeneralComponent } from './payments-bulk-file-upload-general.component';

describe('PaymentsBulkFileUploadGeneralComponent', () => {
  let component: PaymentsBulkFileUploadGeneralComponent;
  let fixture: ComponentFixture<PaymentsBulkFileUploadGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsBulkFileUploadGeneralComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsBulkFileUploadGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

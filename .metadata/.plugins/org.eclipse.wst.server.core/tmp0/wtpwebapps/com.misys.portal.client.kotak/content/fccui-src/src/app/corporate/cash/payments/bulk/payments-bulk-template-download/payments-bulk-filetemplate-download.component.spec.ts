import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsBulkFiletemplateDownloadComponent } from './payments-bulk-filetemplate-download.component';

describe('PaymentsBulkFiletemplateDownloadComponent', () => {
  let component: PaymentsBulkFiletemplateDownloadComponent;
  let fixture: ComponentFixture<PaymentsBulkFiletemplateDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsBulkFiletemplateDownloadComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsBulkFiletemplateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

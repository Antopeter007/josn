import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsFileUploadDialogComponent } from './payments-file-upload-dialog.component';

describe('BeneFileUploadDialogComponent', () => {
  let component: PaymentsFileUploadDialogComponent;
  let fixture: ComponentFixture<PaymentsFileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsFileUploadDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

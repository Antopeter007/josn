import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneFileUploadDialogComponent } from './bene-file-upload-dialog.component';

describe('BeneFileUploadDialogComponent', () => {
  let component: BeneFileUploadDialogComponent;
  let fixture: ComponentFixture<BeneFileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneFileUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

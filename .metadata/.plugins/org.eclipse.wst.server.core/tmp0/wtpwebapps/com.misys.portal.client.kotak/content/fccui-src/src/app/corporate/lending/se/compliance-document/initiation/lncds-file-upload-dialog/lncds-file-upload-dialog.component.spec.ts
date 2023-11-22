import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LncdsFileUploadDialogComponent } from './lncds-file-upload-dialog.component';

describe('LncdsFileUploadDialogComponent', () => {
  let component: LncdsFileUploadDialogComponent;
  let fixture: ComponentFixture<LncdsFileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LncdsFileUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LncdsFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

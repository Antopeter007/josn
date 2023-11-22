import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrFileUploadDialogComponent } from './sr-file-upload-dialog.component';

describe('SrFileUploadDialogComponent', () => {
  let component: SrFileUploadDialogComponent;
  let fixture: ComponentFixture<SrFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

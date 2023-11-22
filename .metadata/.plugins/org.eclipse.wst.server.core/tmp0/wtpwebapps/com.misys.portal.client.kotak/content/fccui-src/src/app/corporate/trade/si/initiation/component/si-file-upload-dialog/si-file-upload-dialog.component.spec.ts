import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiFileUploadDialogComponent } from './si-file-upload-dialog.component';

describe('SiFileUploadDialogComponent', () => {
  let component: SiFileUploadDialogComponent;
  let fixture: ComponentFixture<SiFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFileUploadDialogComponent } from './li-file-upload-dialog.component';

describe('LiFileUploadDialogComponent', () => {
  let component: LiFileUploadDialogComponent;
  let fixture: ComponentFixture<LiFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

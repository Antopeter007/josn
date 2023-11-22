import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiMtbFileUploadDialogComponent } from './li-mtb-file-upload-dialog.component';

describe('LiMtbFileUploadDialogComponent', () => {
  let component: LiMtbFileUploadDialogComponent;
  let fixture: ComponentFixture<LiMtbFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiMtbFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiMtbFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

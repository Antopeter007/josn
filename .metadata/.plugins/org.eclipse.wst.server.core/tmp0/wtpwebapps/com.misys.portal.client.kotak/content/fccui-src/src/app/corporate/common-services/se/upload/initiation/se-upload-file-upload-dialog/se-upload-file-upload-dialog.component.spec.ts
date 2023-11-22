import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeUploadFileUploadDialogComponent } from './se-upload-file-upload-dialog.component';

describe('SeUploadFileUploadDialogComponent', () => {
  let component: SeUploadFileUploadDialogComponent;
  let fixture: ComponentFixture<SeUploadFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeUploadFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeUploadFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

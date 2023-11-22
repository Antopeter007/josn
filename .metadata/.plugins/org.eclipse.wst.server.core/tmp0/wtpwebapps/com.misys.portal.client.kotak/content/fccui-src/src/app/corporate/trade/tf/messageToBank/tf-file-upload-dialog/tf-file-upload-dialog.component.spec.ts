import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfFileUploadDialogComponent } from './tf-file-upload-dialog.component';

describe('TfFileUploadDialogComponent', () => {
  let component: TfFileUploadDialogComponent;
  let fixture: ComponentFixture<TfFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

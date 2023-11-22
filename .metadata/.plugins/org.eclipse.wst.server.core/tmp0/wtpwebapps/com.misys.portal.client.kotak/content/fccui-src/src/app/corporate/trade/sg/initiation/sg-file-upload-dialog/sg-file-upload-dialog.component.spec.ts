import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgFileUploadDialogComponent } from './sg-file-upload-dialog.component';

describe('SgFileUploadDialogComponent', () => {
  let component: SgFileUploadDialogComponent;
  let fixture: ComponentFixture<SgFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnFileUploadDialogComponent } from './ln-file-upload-dialog.component';

describe('LnFileUploadDialogComponent', () => {
  let component: LnFileUploadDialogComponent;
  let fixture: ComponentFixture<LnFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LnFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LnFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeFileUploadDialogComponent } from './se-file-upload-dialog.component';

describe('SeFileUploadDialogComponent', () => {
  let component: SeFileUploadDialogComponent;
  let fixture: ComponentFixture<SeFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

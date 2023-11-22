import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeHelpdeskFileUploadDialogComponent } from './se-helpdesk-file-upload-dialog.component';

describe('SeHelpdeskFileUploadDialogComponent', () => {
  let component: SeHelpdeskFileUploadDialogComponent;
  let fixture: ComponentFixture<SeHelpdeskFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeHelpdeskFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeHelpdeskFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

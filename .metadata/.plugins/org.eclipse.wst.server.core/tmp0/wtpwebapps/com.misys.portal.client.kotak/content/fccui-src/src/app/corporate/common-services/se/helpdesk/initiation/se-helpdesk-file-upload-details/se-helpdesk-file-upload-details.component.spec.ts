import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeHelpdeskFileUploadDetailsComponent } from './se-helpdesk-file-upload-details.component';

describe('SeHelpdeskFileUploadDetailsComponent', () => {
  let component: SeHelpdeskFileUploadDetailsComponent;
  let fixture: ComponentFixture<SeHelpdeskFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeHelpdeskFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeHelpdeskFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

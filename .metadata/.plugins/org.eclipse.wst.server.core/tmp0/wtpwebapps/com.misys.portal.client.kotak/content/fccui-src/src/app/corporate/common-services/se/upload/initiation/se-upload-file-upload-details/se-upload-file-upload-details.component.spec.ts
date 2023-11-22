import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeUploadFileUploadDetailsComponent } from './se-upload-file-upload-details.component';

describe('SeFileUploadDetailsComponent', () => {
  let component: SeUploadFileUploadDetailsComponent;
  let fixture: ComponentFixture<SeUploadFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeUploadFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeUploadFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

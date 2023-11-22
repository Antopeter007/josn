import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrFileUploadDetailsComponent } from './sr-file-upload-details.component';

describe('SrFileUploadDetailsComponent', () => {
  let component: SrFileUploadDetailsComponent;
  let fixture: ComponentFixture<SrFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

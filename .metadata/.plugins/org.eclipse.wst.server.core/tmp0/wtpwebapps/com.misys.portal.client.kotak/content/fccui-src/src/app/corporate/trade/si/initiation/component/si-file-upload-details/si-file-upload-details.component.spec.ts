import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiFileUploadDetailsComponent } from './si-file-upload-details.component';

describe('SiFileUploadDetailsComponent', () => {
  let component: SiFileUploadDetailsComponent;
  let fixture: ComponentFixture<SiFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

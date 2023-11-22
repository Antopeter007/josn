import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFileUploadDetailsComponent } from './li-file-upload-details.component';

describe('LiFileUploadDetailsComponent', () => {
  let component: LiFileUploadDetailsComponent;
  let fixture: ComponentFixture<LiFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

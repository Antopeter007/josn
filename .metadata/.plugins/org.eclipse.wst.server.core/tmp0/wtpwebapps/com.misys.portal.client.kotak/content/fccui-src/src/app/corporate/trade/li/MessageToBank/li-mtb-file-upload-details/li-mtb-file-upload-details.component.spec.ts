import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiMtbFileUploadDetailsComponent } from './li-mtb-file-upload-details.component';

describe('LiMtbFileUploadDetailsComponent', () => {
  let component: LiMtbFileUploadDetailsComponent;
  let fixture: ComponentFixture<LiMtbFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiMtbFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiMtbFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgFileUploadDetailsComponent } from './sg-file-upload-details.component';

describe('SgFileUploadDetailsComponent', () => {
  let component: SgFileUploadDetailsComponent;
  let fixture: ComponentFixture<SgFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

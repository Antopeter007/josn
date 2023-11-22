import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElFileUploadDetailsComponent } from './el-file-upload-details.component';

describe('ElFileUploadDetailsComponent', () => {
  let component: ElFileUploadDetailsComponent;
  let fixture: ComponentFixture<ElFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ElFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

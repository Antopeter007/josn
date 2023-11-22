import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElFileUploadDailogComponent } from './el-file-upload-dailog.component';

describe('ElFileUploadDailogComponent', () => {
  let component: ElFileUploadDailogComponent;
  let fixture: ComponentFixture<ElFileUploadDailogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ElFileUploadDailogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElFileUploadDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

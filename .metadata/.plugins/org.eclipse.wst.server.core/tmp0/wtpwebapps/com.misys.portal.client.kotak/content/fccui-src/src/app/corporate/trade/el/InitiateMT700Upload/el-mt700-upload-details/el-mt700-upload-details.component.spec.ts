import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElMT700UploadDetailsComponent } from './el-mt700-upload-details.component';

describe('ElMT700UploadDetailsComponent', () => {
  let component: ElMT700UploadDetailsComponent;
  let fixture: ComponentFixture<ElMT700UploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElMT700UploadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElMT700UploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

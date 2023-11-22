import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadDragdropComponent } from './file-upload-dragdrop.component';

describe('FileUploadDragdropComponent', () => {
  let component: FileUploadDragdropComponent;
  let fixture: ComponentFixture<FileUploadDragdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadDragdropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadDragdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

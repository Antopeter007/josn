import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcFileUploadDialogComponent } from './ec-file-upload-dialog.component';

describe('EcFileUploadDialogComponent', () => {
  let component: EcFileUploadDialogComponent;
  let fixture: ComponentFixture<EcFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

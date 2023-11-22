import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrFileUploadDialogComponent } from './ir-file-upload-dialog.component';

describe('IrFileUploadDialogComponent', () => {
  let component: IrFileUploadDialogComponent;
  let fixture: ComponentFixture<IrFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IrFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

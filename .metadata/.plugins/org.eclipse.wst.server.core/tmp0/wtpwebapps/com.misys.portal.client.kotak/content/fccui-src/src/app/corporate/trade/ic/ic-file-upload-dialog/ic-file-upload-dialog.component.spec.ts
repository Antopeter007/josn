import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcFileUploadDialogComponent } from './ic-file-upload-dialog.component';

describe('IcFileUploadDialogComponent', () => {
  let component: IcFileUploadDialogComponent;
  let fixture: ComponentFixture<IcFileUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IcFileUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTradeUploadDialogComponent } from './ft-trade-upload-dialog.component';

describe('FtTradeUploadDialogComponent', () => {
  let component: FtTradeUploadDialogComponent;
  let fixture: ComponentFixture<FtTradeUploadDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FtTradeUploadDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtTradeUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

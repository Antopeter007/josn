import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTradeFileUploadDetailsComponent } from './ft-trade-file-upload-details.component';

describe('FtTradeFileUploadDetailsComponent', () => {
  let component: FtTradeFileUploadDetailsComponent;
  let fixture: ComponentFixture<FtTradeFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FtTradeFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtTradeFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

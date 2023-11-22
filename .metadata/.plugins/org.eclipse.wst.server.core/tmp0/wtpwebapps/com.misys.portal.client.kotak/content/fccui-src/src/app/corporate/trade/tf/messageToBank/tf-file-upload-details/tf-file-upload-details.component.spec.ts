import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfFileUploadDetailsComponent } from './tf-file-upload-details.component';

describe('TfFileUploadDetailsComponent', () => {
  let component: TfFileUploadDetailsComponent;
  let fixture: ComponentFixture<TfFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

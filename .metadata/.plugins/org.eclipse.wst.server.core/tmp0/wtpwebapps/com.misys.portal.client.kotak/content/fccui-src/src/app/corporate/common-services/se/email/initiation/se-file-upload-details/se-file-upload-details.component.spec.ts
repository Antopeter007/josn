import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeFileUploadDetailsComponent } from './se-file-upload-details.component';

describe('SeFileUploadDetailsComponent', () => {
  let component: SeFileUploadDetailsComponent;
  let fixture: ComponentFixture<SeFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

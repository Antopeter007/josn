import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcFileUploadDetailsComponent } from './ec-file-upload-details.component';

describe('EcFileUploadDetailsComponent', () => {
  let component: EcFileUploadDetailsComponent;
  let fixture: ComponentFixture<EcFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcFileUploadDetailsComponent } from './ic-file-upload-details.component';

describe('IcFileUploadDetailsComponent', () => {
  let component: IcFileUploadDetailsComponent;
  let fixture: ComponentFixture<IcFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IcFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrFileUploadDetailsComponent } from './ir-file-upload-details.component';

describe('IrFileUploadDetailsComponent', () => {
  let component: IrFileUploadDetailsComponent;
  let fixture: ComponentFixture<IrFileUploadDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IrFileUploadDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

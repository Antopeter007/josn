import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneBulkFileUploadGeneralComponent } from './bene-bulk-file-upload-general.component';

describe('BeneBulkFileUploadGeneralComponent', () => {
  let component: BeneBulkFileUploadGeneralComponent;
  let fixture: ComponentFixture<BeneBulkFileUploadGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneBulkFileUploadGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneBulkFileUploadGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

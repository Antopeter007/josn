import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlfpFileUploadDetailsComponent } from './blfp-file-upload-details.component';

describe('BlfpFileUploadDetailsComponent', () => {
  let component: BlfpFileUploadDetailsComponent;
  let fixture: ComponentFixture<BlfpFileUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlfpFileUploadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlfpFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

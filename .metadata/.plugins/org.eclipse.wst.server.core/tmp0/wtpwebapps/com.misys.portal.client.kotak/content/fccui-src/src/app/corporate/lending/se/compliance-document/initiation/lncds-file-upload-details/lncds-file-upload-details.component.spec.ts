import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LncdsFileUploadDetailsComponent } from './lncds-file-upload-details.component';

describe('LncdsFileUploadDetailsComponent', () => {
  let component: LncdsFileUploadDetailsComponent;
  let fixture: ComponentFixture<LncdsFileUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LncdsFileUploadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LncdsFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

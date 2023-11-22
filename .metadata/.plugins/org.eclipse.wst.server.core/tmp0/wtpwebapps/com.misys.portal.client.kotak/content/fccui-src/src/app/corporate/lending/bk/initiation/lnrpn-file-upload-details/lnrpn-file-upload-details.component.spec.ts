import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnrpnFileUploadDetailsComponent } from './lnrpn-file-upload-details.component';

describe('LnrpnFileUploadDetailsComponent', () => {
  let component: LnrpnFileUploadDetailsComponent;
  let fixture: ComponentFixture<LnrpnFileUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LnrpnFileUploadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrpnFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

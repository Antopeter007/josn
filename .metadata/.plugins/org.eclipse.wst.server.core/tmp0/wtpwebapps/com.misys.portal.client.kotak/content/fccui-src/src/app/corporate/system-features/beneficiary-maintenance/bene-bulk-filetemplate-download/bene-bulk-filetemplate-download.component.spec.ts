import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneBulkFiletemplateDownloadComponent } from './bene-bulk-filetemplate-download.component';

describe('BeneBulkFiletemplateDownloadComponent', () => {
  let component: BeneBulkFiletemplateDownloadComponent;
  let fixture: ComponentFixture<BeneBulkFiletemplateDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneBulkFiletemplateDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneBulkFiletemplateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

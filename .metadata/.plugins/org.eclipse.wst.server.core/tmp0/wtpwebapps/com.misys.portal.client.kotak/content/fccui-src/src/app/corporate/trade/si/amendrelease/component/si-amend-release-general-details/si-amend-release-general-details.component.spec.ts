import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiAmendReleaseGeneralDetailsComponent } from './si-amend-release-general-details.component';

describe('SiAmendReleaseGeneralDetailsComponent', () => {
  let component: SiAmendReleaseGeneralDetailsComponent;
  let fixture: ComponentFixture<SiAmendReleaseGeneralDetailsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiAmendReleaseGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

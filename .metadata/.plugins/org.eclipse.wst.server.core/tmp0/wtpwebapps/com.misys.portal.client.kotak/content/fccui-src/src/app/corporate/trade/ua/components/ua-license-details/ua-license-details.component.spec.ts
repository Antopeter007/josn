import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UaLicenseDetailsComponent } from './ua-license-details.component';

describe('UaLicenseDetailsComponent', () => {
  let component: UaLicenseDetailsComponent;
  let fixture: ComponentFixture<UaLicenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UaLicenseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UaLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUCommonLicenseComponent } from './license.component';

describe('LicenseComponent', () => {
  let component: IUCommonLicenseComponent;
  let fixture: ComponentFixture<IUCommonLicenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUCommonLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUCommonLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

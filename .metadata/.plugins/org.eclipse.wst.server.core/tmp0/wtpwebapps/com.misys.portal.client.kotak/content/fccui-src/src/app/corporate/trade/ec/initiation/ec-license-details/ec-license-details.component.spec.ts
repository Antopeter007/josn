import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcLicenseDetailsComponent } from './ec-license-details.component';

describe('EcLicenseDetailsComponent', () => {
  let component: EcLicenseDetailsComponent;
  let fixture: ComponentFixture<EcLicenseDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcLicenseDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

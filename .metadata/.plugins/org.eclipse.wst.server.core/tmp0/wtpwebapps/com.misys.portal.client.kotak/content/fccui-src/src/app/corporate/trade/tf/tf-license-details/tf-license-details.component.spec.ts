import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfLicenseDetailsComponent } from './tf-license-details.component';

describe('TfLicenseDetailsComponent', () => {
  let component: TfLicenseDetailsComponent;
  let fixture: ComponentFixture<TfLicenseDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfLicenseDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

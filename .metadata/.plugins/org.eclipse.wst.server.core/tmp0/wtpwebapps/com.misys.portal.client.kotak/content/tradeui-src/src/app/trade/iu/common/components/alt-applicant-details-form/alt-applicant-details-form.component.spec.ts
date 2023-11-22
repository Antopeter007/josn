import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUCommonAltApplicantDetailsComponent } from './alt-applicant-details-form.component';

describe('AltApplicantDetailsFormComponent', () => {
  let component: IUCommonAltApplicantDetailsComponent;
  let fixture: ComponentFixture<IUCommonAltApplicantDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUCommonAltApplicantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUCommonAltApplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

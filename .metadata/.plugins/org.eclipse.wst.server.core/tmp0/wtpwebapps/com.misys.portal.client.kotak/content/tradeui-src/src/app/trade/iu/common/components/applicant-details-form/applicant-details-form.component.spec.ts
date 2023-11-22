import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUCommonApplicantDetailsComponent } from './applicant-details-form.component';

describe('ApplicantDetailsFormComponent', () => {
  let component: IUCommonApplicantDetailsComponent;
  let fixture: ComponentFixture<IUCommonApplicantDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUCommonApplicantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUCommonApplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

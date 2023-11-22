import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SetReferenceComponent } from './set-reference.component';

fdescribe('SetCustRefComponent isolation tests', () => {
  let component: SetReferenceComponent;
  let fixture: ComponentFixture<SetReferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [ SetReferenceComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('on click of submit button form should be submitted successfully.', () => {
    // Setting customer reference in the form level
    component.customerRefForm.controls.applicantDetails.get('applicantCustReference').setValue('testCustRef');

    const submitButton = fixture.debugElement.nativeElement.querySelector('[id=submit]');
    submitButton.click();
    expect(component.showForm).toEqual(false);
  });

  fit('fails validation when customer reference is not given in the form submission. ', () => {
    let errors = {};
    const submitButton = fixture.debugElement.nativeElement.querySelector('[id=submit]');
    submitButton.click();

    const applicantCustRef = component.customerRefForm.controls.applicantDetails.get('applicantCustReference');
    errors = applicantCustRef.errors || {};
    expect(errors[`required`]).toBeTruthy();
  });

});

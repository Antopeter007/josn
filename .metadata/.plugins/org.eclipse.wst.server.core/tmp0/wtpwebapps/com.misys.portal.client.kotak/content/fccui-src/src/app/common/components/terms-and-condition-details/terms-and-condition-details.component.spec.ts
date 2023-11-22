import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionDetailsComponent } from './terms-and-condition-details.component';

describe('TermsAndConditionDetailsComponent', () => {
  let component: TermsAndConditionDetailsComponent;
  let fixture: ComponentFixture<TermsAndConditionDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TermsAndConditionDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

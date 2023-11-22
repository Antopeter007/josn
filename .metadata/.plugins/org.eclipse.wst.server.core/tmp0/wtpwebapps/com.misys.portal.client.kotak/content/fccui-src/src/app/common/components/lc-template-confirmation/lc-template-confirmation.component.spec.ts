import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcTemplateConfirmationComponent } from './lc-template-confirmation.component';

describe('LcTemplateConfirmationComponent', () => {
  let component: LcTemplateConfirmationComponent;
  let fixture: ComponentFixture<LcTemplateConfirmationComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LcTemplateConfirmationComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcTemplateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

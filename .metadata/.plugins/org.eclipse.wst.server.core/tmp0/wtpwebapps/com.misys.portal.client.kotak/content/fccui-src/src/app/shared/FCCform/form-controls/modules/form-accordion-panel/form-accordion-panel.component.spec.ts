import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAccordionPanelComponent } from './form-accordion-panel.component';

describe('FormAccordionPanelComponent', () => {
  let component: FormAccordionPanelComponent;
  let fixture: ComponentFixture<FormAccordionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAccordionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAccordionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

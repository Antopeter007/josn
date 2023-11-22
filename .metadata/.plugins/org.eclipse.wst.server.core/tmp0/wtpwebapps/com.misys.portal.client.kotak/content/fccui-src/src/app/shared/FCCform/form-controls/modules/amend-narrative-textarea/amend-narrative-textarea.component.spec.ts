import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendNarrativeTextareaComponent } from './amend-narrative-textarea.component';

describe('AmendNarrativeTextareaComponent', () => {
  let component: AmendNarrativeTextareaComponent;
  let fixture: ComponentFixture<AmendNarrativeTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendNarrativeTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendNarrativeTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

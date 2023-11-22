import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeTextareaComponent } from './narrative-textarea.component';

describe('NarrativeTextareaComponent', () => {
  let component: NarrativeTextareaComponent;
  let fixture: ComponentFixture<NarrativeTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

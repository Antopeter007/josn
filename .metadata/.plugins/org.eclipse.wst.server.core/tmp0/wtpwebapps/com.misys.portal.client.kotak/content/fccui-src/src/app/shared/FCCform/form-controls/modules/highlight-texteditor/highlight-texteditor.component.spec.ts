import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightTexteditorComponent } from './highlight-texteditor.component';

describe('HighlightTexteditorComponent', () => {
  let component: HighlightTexteditorComponent;
  let fixture: ComponentFixture<HighlightTexteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightTexteditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightTexteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

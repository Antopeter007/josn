import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhraseComponent } from './new-phrase.component';

describe('NewPhraseComponent', () => {
  let component: NewPhraseComponent;
  let fixture: ComponentFixture<NewPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPhraseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

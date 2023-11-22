import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeCharacterCountComponent } from './narrative-character-count.component';

describe('NarrativeCharacterCountComponent', () => {
  let component: NarrativeCharacterCountComponent;
  let fixture: ComponentFixture<NarrativeCharacterCountComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ NarrativeCharacterCountComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeCharacterCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

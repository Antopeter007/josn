import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsRequiredComponent } from './documents-required.component';

describe('DocumentsRequiredComponent', () => {
  let component: DocumentsRequiredComponent;
  let fixture: ComponentFixture<DocumentsRequiredComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DocumentsRequiredComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

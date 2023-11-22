import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiDocumentsRequiredComponent } from './si-documents-required.component';

describe('SiDocumentsRequiredComponent', () => {
  let component: SiDocumentsRequiredComponent;
  let fixture: ComponentFixture<SiDocumentsRequiredComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiDocumentsRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiDocumentsRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

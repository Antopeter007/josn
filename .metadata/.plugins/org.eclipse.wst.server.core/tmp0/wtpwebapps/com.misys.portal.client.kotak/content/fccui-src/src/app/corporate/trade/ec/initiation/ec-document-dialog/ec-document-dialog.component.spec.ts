import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcDocumentDialogComponent } from './ec-document-dialog.component';

describe('EcDocumentDialogComponent', () => {
  let component: EcDocumentDialogComponent;
  let fixture: ComponentFixture<EcDocumentDialogComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcDocumentDialogComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

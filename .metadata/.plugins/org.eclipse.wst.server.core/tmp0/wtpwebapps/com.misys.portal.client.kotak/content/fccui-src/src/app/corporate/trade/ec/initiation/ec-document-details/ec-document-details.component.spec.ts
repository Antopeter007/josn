import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcDocumentDetailsComponent } from './ec-document-details.component';

describe('EcDocumentDetailsComponent', () => {
  let component: EcDocumentDetailsComponent;
  let fixture: ComponentFixture<EcDocumentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcDocumentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

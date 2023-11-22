import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccFileViewerComponent } from './fcc-file-viewer.component';

describe('FccDocViewerComponent', () => {
  let component: FccFileViewerComponent;
  let fixture: ComponentFixture<FccFileViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccFileViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccFileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

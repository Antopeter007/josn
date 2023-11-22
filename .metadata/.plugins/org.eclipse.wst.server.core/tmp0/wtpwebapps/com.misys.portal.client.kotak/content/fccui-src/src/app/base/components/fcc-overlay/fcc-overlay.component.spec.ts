import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccOverlayComponent } from './fcc-overlay.component';

describe('FccOverlayComponent', () => {
  let component: FccOverlayComponent;
  let fixture: ComponentFixture<FccOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

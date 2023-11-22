import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModeSelectComponent } from './view-mode-select.component';

describe('ViewModeSelectComponent', () => {
  let component: ViewModeSelectComponent;
  let fixture: ComponentFixture<ViewModeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfWarningComponent } from './tf-warning.component';

describe('TfWarningComponent', () => {
  let component: TfWarningComponent;
  let fixture: ComponentFixture<TfWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TfWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

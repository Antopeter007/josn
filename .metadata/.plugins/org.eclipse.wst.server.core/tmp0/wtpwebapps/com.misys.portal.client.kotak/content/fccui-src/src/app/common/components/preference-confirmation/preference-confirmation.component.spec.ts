import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceConfirmationComponent } from './preference-confirmation.component';

describe('PreferenceConfirmationComponent', () => {
  let component: PreferenceConfirmationComponent;
  let fixture: ComponentFixture<PreferenceConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferenceConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

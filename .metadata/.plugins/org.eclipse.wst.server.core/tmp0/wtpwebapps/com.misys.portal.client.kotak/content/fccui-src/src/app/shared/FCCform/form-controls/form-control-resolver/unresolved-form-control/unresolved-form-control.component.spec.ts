import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnresolvedFormControlComponent } from './unresolved-form-control.component';

describe('UnresolvedFormControlComponent', () => {
  let component: UnresolvedFormControlComponent;
  let fixture: ComponentFixture<UnresolvedFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnresolvedFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnresolvedFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

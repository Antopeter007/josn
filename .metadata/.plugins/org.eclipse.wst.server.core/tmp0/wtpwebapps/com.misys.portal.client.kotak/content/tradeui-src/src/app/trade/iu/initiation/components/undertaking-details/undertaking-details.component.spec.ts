import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UndertakingDetailsComponent } from './undertaking-details.component';

describe('UndertakingDetailsComponent', () => {
  let component: UndertakingDetailsComponent;
  let fixture: ComponentFixture<UndertakingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UndertakingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

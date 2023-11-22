import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiPeriodOfPresentationComponent } from './si-period-of-presentation.component';

describe('SiPeriodOfPresentationComponent', () => {
  let component: SiPeriodOfPresentationComponent;
  let fixture: ComponentFixture<SiPeriodOfPresentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiPeriodOfPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiPeriodOfPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

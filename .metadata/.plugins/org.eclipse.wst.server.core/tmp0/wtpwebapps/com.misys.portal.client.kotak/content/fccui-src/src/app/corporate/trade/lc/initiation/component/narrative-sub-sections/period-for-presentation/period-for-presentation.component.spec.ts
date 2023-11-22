import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodForPresentationComponent } from './period-for-presentation.component';

describe('PeriodForPresentationComponent', () => {
  let component: PeriodForPresentationComponent;
  let fixture: ComponentFixture<PeriodForPresentationComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ PeriodForPresentationComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodForPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

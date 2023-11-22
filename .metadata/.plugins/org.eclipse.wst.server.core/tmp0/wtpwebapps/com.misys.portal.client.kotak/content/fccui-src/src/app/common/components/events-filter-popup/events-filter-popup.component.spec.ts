import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFilterPopupComponent } from './events-filter-popup.component';

describe('EventsFilterPopupComponent', () => {
  let component: EventsFilterPopupComponent;
  let fixture: ComponentFixture<EventsFilterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsFilterPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

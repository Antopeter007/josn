import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourierTrackerComponent } from './courier-tracker.component';
describe('CourierTrackerComponent', () => {
  let component: CourierTrackerComponent;
  let fixture: ComponentFixture<CourierTrackerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierTrackerComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CourierTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

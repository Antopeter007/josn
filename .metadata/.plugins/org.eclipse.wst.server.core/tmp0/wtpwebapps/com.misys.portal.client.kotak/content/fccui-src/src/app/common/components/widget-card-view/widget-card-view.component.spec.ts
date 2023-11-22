import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCardViewComponent } from './widget-card-view.component';

describe('WidgetCardViewComponent', () => {
  let component: WidgetCardViewComponent;
  let fixture: ComponentFixture<WidgetCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetCardViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

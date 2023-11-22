import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListdefChartCommonWidgetComponent } from './listdef-chart-common-widget.component';

describe('ListdefChartCommonWidgetComponent', () => {
  let component: ListdefChartCommonWidgetComponent;
  let fixture: ComponentFixture<ListdefChartCommonWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListdefChartCommonWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdefChartCommonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

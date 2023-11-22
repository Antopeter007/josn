import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdefCommonWidgetComponent } from './listdef-common-widget.component';

describe('ListdefCommonWidgetComponent', () => {
  let component: ListdefCommonWidgetComponent;
  let fixture: ComponentFixture<ListdefCommonWidgetComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ListdefCommonWidgetComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdefCommonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

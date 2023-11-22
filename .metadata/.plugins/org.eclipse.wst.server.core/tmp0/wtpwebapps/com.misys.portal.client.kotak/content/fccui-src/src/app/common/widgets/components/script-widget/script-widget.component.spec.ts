import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptWidgetComponent } from './script-widget.component';

describe('ScriptWidgetComponent', () => {
  let component: ScriptWidgetComponent;
  let fixture: ComponentFixture<ScriptWidgetComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ScriptWidgetComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ngonit of the component', () => {
    //eslint : no-empty-function
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetStaticTextComponent } from './widget-static-text.component';

describe('WidgetStaticTextComponent', () => {
  let component: WidgetStaticTextComponent;
  let fixture: ComponentFixture<WidgetStaticTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetStaticTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetStaticTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

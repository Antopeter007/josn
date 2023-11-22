import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericHtmlComponent } from './generic-html-component';

describe('GenericHtmlComponentComponent', () => {
  let component: GenericHtmlComponent;
  let fixture: ComponentFixture<GenericHtmlComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ GenericHtmlComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
/* tslTpt:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TptGeneralDetailsComponent } from './tpt-general-details.component';


describe('TptGeneralDetailsComponent', () => {
  let component: TptGeneralDetailsComponent;
  let fixture: ComponentFixture<TptGeneralDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TptGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TptGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

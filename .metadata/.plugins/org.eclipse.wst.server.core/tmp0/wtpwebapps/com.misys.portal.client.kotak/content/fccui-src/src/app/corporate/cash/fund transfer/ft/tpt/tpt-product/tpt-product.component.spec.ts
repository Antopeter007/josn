/* eslint-disable @typescript-eslint/no-unused-vars */
/* tslTpt:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TptProductComponent } from './tpt-product.component';

describe('TptProductComponent', () => {
  let component: TptProductComponent;
  let fixture: ComponentFixture<TptProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TptProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TptProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

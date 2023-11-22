/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TdCstdProductComponent } from './td-cstd-product.component';

describe('TdCstdProductComponent', () => {
  let component: TdCstdProductComponent;
  let fixture: ComponentFixture<TdCstdProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdCstdProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdCstdProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

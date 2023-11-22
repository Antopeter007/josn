/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TdCstdUpdateGeneralDetailsComponent } from './td-cstd-update-general-details.component';

describe('TdCstdUpdateGeneralDetailsComponent', () => {
  let component: TdCstdUpdateGeneralDetailsComponent;
  let fixture: ComponentFixture<TdCstdUpdateGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdCstdUpdateGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdCstdUpdateGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

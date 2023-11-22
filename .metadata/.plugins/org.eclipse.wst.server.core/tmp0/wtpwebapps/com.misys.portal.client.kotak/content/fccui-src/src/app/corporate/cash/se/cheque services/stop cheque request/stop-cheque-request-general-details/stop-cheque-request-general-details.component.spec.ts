/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StopChequeRequestGeneralDetailsComponent } from './stop-cheque-request-general-details.component';

describe('StopChequeRequestGeneralDetailsComponent', () => {
  let component: StopChequeRequestGeneralDetailsComponent;
  let fixture: ComponentFixture<StopChequeRequestGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopChequeRequestGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopChequeRequestGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

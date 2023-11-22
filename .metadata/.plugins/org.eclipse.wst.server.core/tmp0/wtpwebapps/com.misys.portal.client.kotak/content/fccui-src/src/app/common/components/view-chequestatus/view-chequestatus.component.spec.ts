import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChequestatusComponent } from './view-chequestatus.component';

describe('ViewChequestatusComponent', () => {
  let component: ViewChequestatusComponent;
  let fixture: ComponentFixture<ViewChequestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChequestatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChequestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

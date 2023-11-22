import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtCashGeneralDetailsComponent } from './ft-cash-general-details.component';

describe('FtCashGeneralDetailsComponent', () => {
  let component: FtCashGeneralDetailsComponent;
  let fixture: ComponentFixture<FtCashGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtCashGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtCashGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

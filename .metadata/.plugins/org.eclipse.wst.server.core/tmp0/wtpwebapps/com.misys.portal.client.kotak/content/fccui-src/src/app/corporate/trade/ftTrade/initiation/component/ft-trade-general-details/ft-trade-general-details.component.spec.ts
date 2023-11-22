import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTradeGeneralDetailsComponent } from './ft-trade-general-details.component';

describe('FtTradeGeneralDetailsComponent', () => {
  let component: FtTradeGeneralDetailsComponent;
  let fixture: ComponentFixture<FtTradeGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FtTradeGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtTradeGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

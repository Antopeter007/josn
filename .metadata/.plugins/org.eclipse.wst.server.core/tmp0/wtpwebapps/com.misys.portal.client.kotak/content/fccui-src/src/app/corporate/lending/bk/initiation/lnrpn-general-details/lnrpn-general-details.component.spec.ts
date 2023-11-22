import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnrpnGeneralDetailsComponent } from './lnrpn-general-details.component';

describe('LnrpnGeneralDetailsComponent', () => {
  let component: LnrpnGeneralDetailsComponent;
  let fixture: ComponentFixture<LnrpnGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LnrpnGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrpnGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

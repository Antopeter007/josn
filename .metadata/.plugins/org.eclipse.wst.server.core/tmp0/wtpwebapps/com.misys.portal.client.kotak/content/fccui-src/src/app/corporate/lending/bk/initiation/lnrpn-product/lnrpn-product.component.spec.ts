import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LnrpnProductComponent } from './lnrpn-product.component';

describe('LnrpnProductComponent', () => {
  let component: LnrpnProductComponent;
  let fixture: ComponentFixture<LnrpnProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LnrpnProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrpnProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

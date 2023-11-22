import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtCashProductComponent } from './ft-cash-product.component';

describe('FtCashProductComponent', () => {
  let component: FtCashProductComponent;
  let fixture: ComponentFixture<FtCashProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtCashProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtCashProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlfpProductComponent } from './blfp-product.component';

describe('BlfpProductComponent', () => {
  let component: BlfpProductComponent;
  let fixture: ComponentFixture<BlfpProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlfpProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlfpProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

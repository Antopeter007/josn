import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentProductComponent } from './instrument-product.component';

describe('InstrumentProductComponent', () => {
  let component: InstrumentProductComponent;
  let fixture: ComponentFixture<InstrumentProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

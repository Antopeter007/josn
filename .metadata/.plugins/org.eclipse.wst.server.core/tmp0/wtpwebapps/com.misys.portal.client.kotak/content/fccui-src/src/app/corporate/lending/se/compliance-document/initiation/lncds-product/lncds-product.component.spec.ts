import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LncdsProductComponent } from './lncds-product.component';

describe('LncdsProductComponent', () => {
  let component: LncdsProductComponent;
  let fixture: ComponentFixture<LncdsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LncdsProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LncdsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

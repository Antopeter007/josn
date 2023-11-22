import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrProductComponent } from './ir-product.component';

describe('IrProductComponent', () => {
  let component: IrProductComponent;
  let fixture: ComponentFixture<IrProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IrProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

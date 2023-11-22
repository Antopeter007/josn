import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcProductComponent } from './ic-product.component';

describe('IcProductComponent', () => {
  let component: IcProductComponent;
  let fixture: ComponentFixture<IcProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IcProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

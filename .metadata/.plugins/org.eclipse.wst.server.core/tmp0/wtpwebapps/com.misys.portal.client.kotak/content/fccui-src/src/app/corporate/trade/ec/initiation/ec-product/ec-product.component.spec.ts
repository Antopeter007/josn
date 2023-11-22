import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcProductComponent } from './ec-product.component';

describe('EcProductComponent', () => {
  let component: EcProductComponent;
  let fixture: ComponentFixture<EcProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiProductComponent } from './si-product.component';

describe('SiProductComponent', () => {
  let component: SiProductComponent;
  let fixture: ComponentFixture<SiProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

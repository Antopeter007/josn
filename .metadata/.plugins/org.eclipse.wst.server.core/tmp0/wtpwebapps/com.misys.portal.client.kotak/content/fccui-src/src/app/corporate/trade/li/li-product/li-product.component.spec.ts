import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiProductComponent } from './li-product.component';

describe('LiProductComponent', () => {
  let component: LiProductComponent;
  let fixture: ComponentFixture<LiProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

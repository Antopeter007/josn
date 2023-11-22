import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiProductComponent } from './ui-product.component';

describe('UiProductComponent', () => {
  let component: UiProductComponent;
  let fixture: ComponentFixture<UiProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ UiProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

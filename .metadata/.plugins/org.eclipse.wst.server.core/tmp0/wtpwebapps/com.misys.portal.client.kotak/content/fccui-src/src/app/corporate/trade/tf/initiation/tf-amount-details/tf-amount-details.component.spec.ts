import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfAmountDetailsComponent } from './tf-amount-details.component';

describe('TfAmountDetailsComponent', () => {
  let component: TfAmountDetailsComponent;
  let fixture: ComponentFixture<TfAmountDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfAmountDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

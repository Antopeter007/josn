import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionOfGoodsComponent } from './description-of-goods.component';

describe('DescriptionOfGoodsComponent', () => {
  let component: DescriptionOfGoodsComponent;
  let fixture: ComponentFixture<DescriptionOfGoodsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DescriptionOfGoodsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

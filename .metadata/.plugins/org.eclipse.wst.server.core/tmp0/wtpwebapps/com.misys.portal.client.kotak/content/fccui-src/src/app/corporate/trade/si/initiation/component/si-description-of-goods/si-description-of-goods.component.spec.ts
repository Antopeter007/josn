import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiDescriptionOfGoodsComponent } from './si-description-of-goods.component';

describe('SiDescriptionOfGoodsComponent', () => {
  let component: SiDescriptionOfGoodsComponent;
  let fixture: ComponentFixture<SiDescriptionOfGoodsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiDescriptionOfGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiDescriptionOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

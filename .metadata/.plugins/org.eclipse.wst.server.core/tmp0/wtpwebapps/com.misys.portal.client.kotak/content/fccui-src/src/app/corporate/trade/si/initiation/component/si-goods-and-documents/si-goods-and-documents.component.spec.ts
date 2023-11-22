import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiGoodsAndDocumentsComponent } from './si-goods-and-documents.component';

describe('SiGoodsAndDocumentsComponent', () => {
  let component: SiGoodsAndDocumentsComponent;
  let fixture: ComponentFixture<SiGoodsAndDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiGoodsAndDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiGoodsAndDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

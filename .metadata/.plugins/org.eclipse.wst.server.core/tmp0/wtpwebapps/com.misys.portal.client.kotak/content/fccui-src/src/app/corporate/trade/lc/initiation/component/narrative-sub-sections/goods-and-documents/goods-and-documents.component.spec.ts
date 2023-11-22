import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsAndDocumentsComponent } from './goods-and-documents.component';

describe('GoodsAndDocumentsComponent', () => {
  let component: GoodsAndDocumentsComponent;
  let fixture: ComponentFixture<GoodsAndDocumentsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ GoodsAndDocumentsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsAndDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

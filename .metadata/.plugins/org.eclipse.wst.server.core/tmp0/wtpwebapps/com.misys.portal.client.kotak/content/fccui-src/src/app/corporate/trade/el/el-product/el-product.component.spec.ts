import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElProductComponent } from './el-product.component';

describe('ElProductComponent', () => {
  let component: ElProductComponent;
  let fixture: ComponentFixture<ElProductComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ElProductComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

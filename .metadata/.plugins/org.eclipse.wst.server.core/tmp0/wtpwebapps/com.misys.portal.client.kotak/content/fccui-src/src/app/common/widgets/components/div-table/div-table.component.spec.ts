import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivTableComponent } from './div-table.component';

describe('DivTableComponent', () => {
  let component: DivTableComponent;
  let fixture: ComponentFixture<DivTableComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DivTableComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniStatmentTableComponent } from './mini-statment-table.component';

describe('MiniStatmentTableComponent', () => {
  let component: MiniStatmentTableComponent;
  let fixture: ComponentFixture<MiniStatmentTableComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ MiniStatmentTableComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniStatmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

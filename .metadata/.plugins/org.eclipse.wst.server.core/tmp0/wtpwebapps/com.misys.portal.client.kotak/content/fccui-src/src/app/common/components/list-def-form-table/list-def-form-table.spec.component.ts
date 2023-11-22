import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDefFormTableComponent } from './list-def-form-table.component';

describe('ListDefFormTableComponent', () => {
  let component: ListDefFormTableComponent;
  let fixture: ComponentFixture<ListDefFormTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDefFormTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDefFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

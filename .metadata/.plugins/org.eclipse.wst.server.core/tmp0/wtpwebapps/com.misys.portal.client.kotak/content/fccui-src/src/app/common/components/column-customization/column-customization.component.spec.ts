import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnCustomizationComponent } from './column-customization.component';

describe('ColumnCustomizationComponent', () => {
  let component: ColumnCustomizationComponent;
  let fixture: ComponentFixture<ColumnCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnCustomizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

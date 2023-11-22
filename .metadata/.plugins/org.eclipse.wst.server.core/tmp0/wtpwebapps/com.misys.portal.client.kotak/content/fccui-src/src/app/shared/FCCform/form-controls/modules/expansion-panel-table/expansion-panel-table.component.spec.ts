import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelTableComponent } from './expansion-panel-table.component';

describe('ExpansionPanelTableComponent', () => {
  let component: ExpansionPanelTableComponent;
  let fixture: ComponentFixture<ExpansionPanelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionPanelTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

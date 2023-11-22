import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelEditTableComponent } from './expansion-panel-edit-table.component';

describe('ExpansionPanelEditTableComponent', () => {
  let component: ExpansionPanelEditTableComponent;
  let fixture: ComponentFixture<ExpansionPanelEditTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionPanelEditTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelEditFormTableComponent } from './expansion-panel-edit-form-table.component';

describe('ExpansionPanelEditFormTableComponent', () => {
  
    let component: ExpansionPanelEditFormTableComponent;
    let fixture: ComponentFixture<ExpansionPanelEditFormTableComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ExpansionPanelEditFormTableComponent ]
      })
      .compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ExpansionPanelEditFormTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});

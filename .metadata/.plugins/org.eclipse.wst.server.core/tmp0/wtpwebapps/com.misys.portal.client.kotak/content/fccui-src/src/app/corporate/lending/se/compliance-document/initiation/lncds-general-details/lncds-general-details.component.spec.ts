import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LncdsGeneralDetailsComponent } from './lncds-general-details.component';

describe('LncdsGeneralDetailsComponent', () => {
  let component: LncdsGeneralDetailsComponent;
  let fixture: ComponentFixture<LncdsGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LncdsGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LncdsGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

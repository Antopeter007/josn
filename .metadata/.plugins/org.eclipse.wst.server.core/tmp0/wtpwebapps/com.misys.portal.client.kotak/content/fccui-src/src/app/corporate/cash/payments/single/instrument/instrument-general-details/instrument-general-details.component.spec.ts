import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentGeneralDetailsComponent } from './instrument-general-details.component';

describe('InstrumentGeneralDetailsComponent', () => {
  let component: InstrumentGeneralDetailsComponent;
  let fixture: ComponentFixture<InstrumentGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

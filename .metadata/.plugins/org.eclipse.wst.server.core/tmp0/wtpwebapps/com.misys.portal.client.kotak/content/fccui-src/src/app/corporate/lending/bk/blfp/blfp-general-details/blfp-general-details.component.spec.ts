import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlfpGeneralDetailsComponent } from './blfp-general-details.component';

describe('BlfpGeneralDetailsComponent', () => {
  let component: BlfpGeneralDetailsComponent;
  let fixture: ComponentFixture<BlfpGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlfpGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlfpGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BkGeneralDetailsComponent } from './bk-general-details.component';

describe('BkGeneralDetailsComponent', () => {
  let component: BkGeneralDetailsComponent;
  let fixture: ComponentFixture<BkGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BkGeneralDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BkGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

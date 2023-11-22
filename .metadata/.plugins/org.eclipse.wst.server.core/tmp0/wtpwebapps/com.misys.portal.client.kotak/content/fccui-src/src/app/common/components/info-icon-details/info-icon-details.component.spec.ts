import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIconDetailsComponent } from './info-icon-details.component';

describe('InfoIconDetailsComponent', () => {
  let component: InfoIconDetailsComponent;
  let fixture: ComponentFixture<InfoIconDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoIconDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIconDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

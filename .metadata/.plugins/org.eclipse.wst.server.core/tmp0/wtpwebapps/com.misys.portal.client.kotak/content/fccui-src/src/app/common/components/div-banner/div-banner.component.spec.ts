import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivBannerComponent } from './div-banner.component';

describe('DivBannerComponent', () => {
  let component: DivBannerComponent;
  let fixture: ComponentFixture<DivBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

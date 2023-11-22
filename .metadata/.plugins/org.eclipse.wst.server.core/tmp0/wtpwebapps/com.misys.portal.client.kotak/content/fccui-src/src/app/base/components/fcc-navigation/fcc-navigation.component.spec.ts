import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccNavigationComponent } from './fcc-navigation.component';

describe('FccNavigationComponent', () => {
  let component: FccNavigationComponent;
  let fixture: ComponentFixture<FccNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

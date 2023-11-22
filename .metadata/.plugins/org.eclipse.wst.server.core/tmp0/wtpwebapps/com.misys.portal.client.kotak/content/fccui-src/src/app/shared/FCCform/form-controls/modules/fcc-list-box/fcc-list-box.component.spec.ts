import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccListBoxComponent } from './fcc-list-box.component';

describe('FccListBoxComponent', () => {
  let component: FccListBoxComponent;
  let fixture: ComponentFixture<FccListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccListBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FccListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdefPopupComponent } from './listdef-popup.component';

describe('ListdefPopupComponent', () => {
  let component: ListdefPopupComponent;
  let fixture: ComponentFixture<ListdefPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListdefPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdefPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

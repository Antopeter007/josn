import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdefModalComponent } from './listdef-modal.component';

describe('ListdefModalComponent', () => {
  let component: ListdefModalComponent;
  let fixture: ComponentFixture<ListdefModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListdefModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdefModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

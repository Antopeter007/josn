import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccNewsSubComponent } from './fcc-news-sub.component';

describe('FccNewsSubComponent', () => {
  let component: FccNewsSubComponent;
  let fixture: ComponentFixture<FccNewsSubComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FccNewsSubComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FccNewsSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

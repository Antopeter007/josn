import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccMoreNewsComponent } from './fcc-more-news.component';

describe('FccMoreNewsComponent', () => {
  let component: FccMoreNewsComponent;
  let fixture: ComponentFixture<FccMoreNewsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FccMoreNewsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FccMoreNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

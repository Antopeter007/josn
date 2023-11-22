import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiOtherDetailsComponent } from './si-other-details.component';

describe('SiOtherDetailsComponent', () => {
  let component: SiOtherDetailsComponent;
  let fixture: ComponentFixture<SiOtherDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiOtherDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

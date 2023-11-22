import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiNarrativeDetailsComponent } from './si-narrative-details.component';

describe('SiNarrativeDetailsComponent', () => {
  let component: SiNarrativeDetailsComponent;
  let fixture: ComponentFixture<SiNarrativeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiNarrativeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiNarrativeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

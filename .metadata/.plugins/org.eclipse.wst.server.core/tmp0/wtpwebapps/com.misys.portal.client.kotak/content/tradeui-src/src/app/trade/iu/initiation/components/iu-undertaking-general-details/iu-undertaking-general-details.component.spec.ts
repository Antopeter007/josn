import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UndertakingGeneralDetailsComponent } from './iu-undertaking-general-details.component';

describe('UndertakingGeneralDetailsComponent', () => {
  let component: UndertakingGeneralDetailsComponent;
  let fixture: ComponentFixture<UndertakingGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UndertakingGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

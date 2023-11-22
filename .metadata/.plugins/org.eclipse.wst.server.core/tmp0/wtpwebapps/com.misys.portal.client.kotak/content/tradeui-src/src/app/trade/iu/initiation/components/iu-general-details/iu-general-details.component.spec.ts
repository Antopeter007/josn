import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUGeneralDetailsComponent } from './iu-general-details.component';

describe('IUGeneralDetailsComponent', () => {
  let component: IUGeneralDetailsComponent;
  let fixture: ComponentFixture<IUGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

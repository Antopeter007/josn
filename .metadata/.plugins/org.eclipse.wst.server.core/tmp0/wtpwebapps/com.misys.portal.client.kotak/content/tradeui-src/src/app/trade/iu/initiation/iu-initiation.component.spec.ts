import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IUInitiationComponent } from './iu-initiation.component';

describe('IUInitiationComponent', () => {
  let component: IUInitiationComponent;
  let fixture: ComponentFixture<IUInitiationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IUInitiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IUInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

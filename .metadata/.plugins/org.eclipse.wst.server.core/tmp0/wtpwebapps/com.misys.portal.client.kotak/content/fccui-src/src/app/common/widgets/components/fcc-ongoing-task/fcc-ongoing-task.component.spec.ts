import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccOngoingTaskComponent } from './fcc-ongoing-task.component';

describe('FccOngoingTaskComponent', () => {
  let component: FccOngoingTaskComponent;
  let fixture: ComponentFixture<FccOngoingTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccOngoingTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccOngoingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

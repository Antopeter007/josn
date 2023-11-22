import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SetEntityComponent } from './set-entity.component';

describe('SetEntityComponent', () => {
  let component: SetEntityComponent;
  let fixture: ComponentFixture<SetEntityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

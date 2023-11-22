import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModifyTemplateComponent } from './modify-template.component';

describe('ModifyTemplateComponent', () => {
  let component: ModifyTemplateComponent;
  let fixture: ComponentFixture<ModifyTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveCredentialsComponent } from './retrieve-credentials.component';

describe('RetrieveCredentialsComponent', () => {
  let component: RetrieveCredentialsComponent;
  let fixture: ComponentFixture<RetrieveCredentialsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ RetrieveCredentialsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

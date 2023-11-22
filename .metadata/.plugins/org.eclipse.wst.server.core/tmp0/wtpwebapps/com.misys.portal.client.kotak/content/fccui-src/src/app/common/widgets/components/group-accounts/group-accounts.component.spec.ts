import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAccountsComponent } from './group-accounts.component';

describe('GroupAccountsComponent', () => {
  let component: GroupAccountsComponent;
  let fixture: ComponentFixture<GroupAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

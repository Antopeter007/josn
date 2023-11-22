import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoDeeplinkUrlComponent } from './sso-deeplink-url.component';

describe('SsoDeeplinkUrlComponent', () => {
  let component: SsoDeeplinkUrlComponent;
  let fixture: ComponentFixture<SsoDeeplinkUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsoDeeplinkUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoDeeplinkUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

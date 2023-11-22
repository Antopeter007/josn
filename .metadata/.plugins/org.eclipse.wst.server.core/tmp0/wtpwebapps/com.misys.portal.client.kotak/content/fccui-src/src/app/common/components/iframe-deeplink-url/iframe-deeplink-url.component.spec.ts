import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeDeeplinkUrlComponent } from './iframe-deeplink-url.component';

describe('IframeDeeplinkUrlComponent', () => {
  let component: IframeDeeplinkUrlComponent;
  let fixture: ComponentFixture<IframeDeeplinkUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeDeeplinkUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeDeeplinkUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

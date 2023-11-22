import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPanelListingComponent } from './tab-panel-listing.component';

describe('TabPanelListingComponent', () => {
  let component: TabPanelListingComponent;
  let fixture: ComponentFixture<TabPanelListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabPanelListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPanelListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

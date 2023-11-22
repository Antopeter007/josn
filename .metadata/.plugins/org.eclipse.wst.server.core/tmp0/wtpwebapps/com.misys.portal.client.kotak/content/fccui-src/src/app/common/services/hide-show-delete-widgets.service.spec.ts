import { TestBed } from '@angular/core/testing';

import { HideShowDeleteWidgetsService } from './hide-show-delete-widgets.service';

describe('HideShowDeleteWidgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HideShowDeleteWidgetsService = TestBed.inject(HideShowDeleteWidgetsService);
    expect(service).toBeTruthy();
  });
});

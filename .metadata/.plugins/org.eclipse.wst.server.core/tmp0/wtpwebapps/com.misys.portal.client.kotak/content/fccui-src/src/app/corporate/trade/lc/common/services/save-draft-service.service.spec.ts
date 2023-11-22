import { TestBed } from '@angular/core/testing';

import { SaveDraftService } from './save-draft.service';

describe('SaveDraftServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveDraftService = TestBed.inject(SaveDraftService);
    expect(service).toBeTruthy();
  });
});

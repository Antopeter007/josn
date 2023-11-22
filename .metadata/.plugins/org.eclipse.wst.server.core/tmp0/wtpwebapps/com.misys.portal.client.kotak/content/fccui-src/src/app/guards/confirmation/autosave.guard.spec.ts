import { TestBed } from '@angular/core/testing';

import { AutosaveGuard } from './autosave.guard';

describe('AutosaveGuard', () => {
  let guard: AutosaveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutosaveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

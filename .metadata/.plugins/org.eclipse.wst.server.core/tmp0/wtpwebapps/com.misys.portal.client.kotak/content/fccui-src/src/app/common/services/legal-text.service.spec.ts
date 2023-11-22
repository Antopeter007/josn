import { TestBed } from '@angular/core/testing';

import { LegalTextService } from './legal-text.service';

describe('LegalTextService', () => {
  let service: LegalTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

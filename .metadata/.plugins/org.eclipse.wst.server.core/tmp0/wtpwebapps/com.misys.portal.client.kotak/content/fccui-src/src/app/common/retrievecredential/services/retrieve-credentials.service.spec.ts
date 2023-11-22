import { TestBed } from '@angular/core/testing';

import { RetrieveCredentialsService } from './retrieve-credentials.service';

describe('RetrieveCredentialsService', () => {
  let service: RetrieveCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

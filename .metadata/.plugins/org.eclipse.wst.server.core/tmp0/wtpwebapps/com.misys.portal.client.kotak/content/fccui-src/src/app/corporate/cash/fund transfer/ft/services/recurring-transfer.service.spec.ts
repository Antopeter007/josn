import { TestBed } from '@angular/core/testing';

import { RecurringTransferService } from './recurring-transfer.service';

describe('RecurringTransferService', () => {
  let service: RecurringTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurringTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ListDefService } from './listdef.service';

describe('ListDefService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListDefService = TestBed.inject(ListDefService);
    expect(service).toBeTruthy();
  });
});

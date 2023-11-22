import { TestBed } from '@angular/core/testing';

import { FormService } from './listdef-form-service';

describe('FormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormService = TestBed.inject(FormService);
    expect(service).toBeTruthy();
  });
});

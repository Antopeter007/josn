import { TestBed } from '@angular/core/testing';

import { FileUploadHandlerService } from './file-upload-handler.service';

describe('FileUploadHandlerService', () => {
  let service: FileUploadHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

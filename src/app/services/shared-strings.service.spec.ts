import { TestBed, inject } from '@angular/core/testing';

import { SharedStringsService } from './shared-strings.service';

describe('SharedStringsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedStringsService]
    });
  });

  it('should be created', inject([SharedStringsService], (service: SharedStringsService) => {
    expect(service).toBeTruthy();
  }));
});

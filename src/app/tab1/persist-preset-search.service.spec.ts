import { TestBed } from '@angular/core/testing';

import { PersistPresetSearchService } from './persist-preset-search.service';

describe('PersistPresetSearchService', () => {
  let service: PersistPresetSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistPresetSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

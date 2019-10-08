import { TestBed } from '@angular/core/testing';

import { JsMapsProviderService } from './js-maps-provider.service';

describe('JsMapsProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsMapsProviderService = TestBed.get(JsMapsProviderService);
    expect(service).toBeTruthy();
  });
});

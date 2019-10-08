import { TestBed } from '@angular/core/testing';

import { NativeMapsProviderService } from './native-maps-provider.service';

describe('NativeMapsProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeMapsProviderService = TestBed.get(NativeMapsProviderService);
    expect(service).toBeTruthy();
  });
});

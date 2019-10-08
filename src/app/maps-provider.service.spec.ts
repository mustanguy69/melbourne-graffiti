import { TestBed } from '@angular/core/testing';

import { MapsProviderService } from './maps-provider.service';

describe('MapsProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapsProviderService = TestBed.get(MapsProviderService);
    expect(service).toBeTruthy();
  });
});

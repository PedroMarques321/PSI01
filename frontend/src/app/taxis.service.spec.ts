import { TestBed } from '@angular/core/testing';

import { TaxisService } from './taxis.service';

describe('TaxisService', () => {
  let service: TaxisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

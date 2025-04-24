import { TestBed } from '@angular/core/testing';

import { InitServiceService } from './init-service.service';

describe('InitServiceService', () => {
  let service: InitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

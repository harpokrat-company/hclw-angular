import { TestBed } from '@angular/core/testing';

import { HclwService } from './hclw.service';

describe('HclwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HclwService = TestBed.get(HclwService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UserHomeService } from './user-home.service';

describe('UserHomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserHomeService = TestBed.get(UserHomeService);
    expect(service).toBeTruthy();
  });
});

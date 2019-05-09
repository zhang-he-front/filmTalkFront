import { TestBed } from '@angular/core/testing';

import { MypartHomeService } from './mypart-home.service';

describe('MypartHomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MypartHomeService = TestBed.get(MypartHomeService);
    expect(service).toBeTruthy();
  });
});

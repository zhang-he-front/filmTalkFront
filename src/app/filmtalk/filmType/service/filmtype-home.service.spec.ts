import { TestBed } from '@angular/core/testing';

import { FilmtypeHomeService } from './filmtype-home.service';

describe('FilmtypeHomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilmtypeHomeService = TestBed.get(FilmtypeHomeService);
    expect(service).toBeTruthy();
  });
});

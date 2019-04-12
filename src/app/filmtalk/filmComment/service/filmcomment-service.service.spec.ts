import { TestBed } from '@angular/core/testing';

import { FilmcommentServiceService } from './filmcomment-service.service';

describe('FilmcommentServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilmcommentServiceService = TestBed.get(FilmcommentServiceService);
    expect(service).toBeTruthy();
  });
});

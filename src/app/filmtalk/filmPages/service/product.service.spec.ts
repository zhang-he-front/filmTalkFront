import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {expect} from "@angular/platform-browser/testing/src/matchers";
import {describe} from "jasmine";

describe('ProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductService = TestBed.get(ProductService);
    expect(service).toBeTruthy();
  });
});

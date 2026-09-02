import { TestBed } from '@angular/core/testing';

import { StoreItemsHttpService } from './store-items-http.service';

describe('PostsService', () => {
  let service: StoreItemsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreItemsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

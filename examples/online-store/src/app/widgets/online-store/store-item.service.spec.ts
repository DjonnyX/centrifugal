import { TestBed } from '@angular/core/testing';

import { StoreItemService } from './store-item.service';

describe('StoreItemService', () => {
  let service: StoreItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

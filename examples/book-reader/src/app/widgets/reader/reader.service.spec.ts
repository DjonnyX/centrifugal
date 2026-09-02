import { TestBed } from '@angular/core/testing';

import { ReaderHttpService } from './reader-http.service';

describe('MessagesService', () => {
  let service: ReaderHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReaderHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

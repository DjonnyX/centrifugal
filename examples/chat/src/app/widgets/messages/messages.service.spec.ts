import { TestBed } from '@angular/core/testing';

import { MessagesHttpService } from './messages-http.service';

describe('MessagesService', () => {
  let service: MessagesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

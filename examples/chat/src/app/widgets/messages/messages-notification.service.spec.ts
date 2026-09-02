import { TestBed } from '@angular/core/testing';

import { MessagesNotificationWSService } from './messages-notification-ws.service';

describe('MessagesNotificationWSService', () => {
  let service: MessagesNotificationWSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesNotificationWSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

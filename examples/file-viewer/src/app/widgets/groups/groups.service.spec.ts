import { TestBed } from '@angular/core/testing';

import { GroupsWebsocketService } from './groups-websocket.service';

describe('GroupsService', () => {
  let service: GroupsWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

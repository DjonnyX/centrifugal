import { TestBed } from '@angular/core/testing';

import { SwipeImageHttpService } from './swipe-image-http.service';

describe('MessagesService', () => {
  let service: SwipeImageHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwipeImageHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

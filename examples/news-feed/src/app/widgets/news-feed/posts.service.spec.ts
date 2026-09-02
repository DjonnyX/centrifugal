import { TestBed } from '@angular/core/testing';

import { PostsHttpService } from './posts-http.service';

describe('PostsService', () => {
  let service: PostsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsLoadingIndicatorComponent } from './posts-loading-indicator.component';

describe('PostsLoadingIndicatorComponent', () => {
  let component: PostsLoadingIndicatorComponent;
  let fixture: ComponentFixture<PostsLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

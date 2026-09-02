import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsGroupComponent } from './posts-group.component';

describe('PostsGroupComponent', () => {
  let component: PostsGroupComponent;
  let fixture: ComponentFixture<PostsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

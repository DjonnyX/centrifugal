import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBoxComponent } from './post-box.component';

describe('PostBoxComponent', () => {
  let component: PostBoxComponent;
  let fixture: ComponentFixture<PostBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

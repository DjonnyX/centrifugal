import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSubstrateComponent } from './post-substrate.component';

describe('PostSubstrateComponent', () => {
  let component: PostSubstrateComponent;
  let fixture: ComponentFixture<PostSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

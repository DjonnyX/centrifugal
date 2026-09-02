import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeImageComponent } from './swipe-image.component';

describe('SwipeImageComponent', () => {
  let component: SwipeImageComponent;
  let fixture: ComponentFixture<SwipeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

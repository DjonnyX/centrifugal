import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollToStartButtonComponent } from './scroll-to-start-button.component';

describe('ScrollToStartButtonComponent', () => {
  let component: ScrollToStartButtonComponent;
  let fixture: ComponentFixture<ScrollToStartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToStartButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollToStartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

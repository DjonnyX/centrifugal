import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookScrollToStartButtonComponent } from './book-scroll-to-start-button.component';

describe('BookScrollToStartButtonComponent', () => {
  let component: BookScrollToStartButtonComponent;
  let fixture: ComponentFixture<BookScrollToStartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookScrollToStartButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookScrollToStartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

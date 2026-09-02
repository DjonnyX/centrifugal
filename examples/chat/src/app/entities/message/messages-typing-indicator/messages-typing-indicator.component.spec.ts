import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTypingIndicatorComponent } from './messages-typing-indicator.component';

describe('MessagesTypingIndicatorComponent', () => {
  let component: MessagesTypingIndicatorComponent;
  let fixture: ComponentFixture<MessagesTypingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesTypingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesTypingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

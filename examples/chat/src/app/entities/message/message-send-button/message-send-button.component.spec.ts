import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendButtonComponent } from './message-send-button.component';

describe('MessageSendButtonComponent', () => {
  let component: MessageSendButtonComponent;
  let fixture: ComponentFixture<MessageSendButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSendButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSendButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

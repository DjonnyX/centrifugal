import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageScrollToEndButtonComponent } from './message-scroll-to-end-button.component';

describe('MessageScrollToEndButtonComponent', () => {
  let component: MessageScrollToEndButtonComponent;
  let fixture: ComponentFixture<MessageScrollToEndButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageScrollToEndButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageScrollToEndButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

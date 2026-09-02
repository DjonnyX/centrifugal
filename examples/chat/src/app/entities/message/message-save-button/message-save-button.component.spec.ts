import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSaveButtonComponent } from './message-save-button.component';

describe('MessageSaveButtonComponent', () => {
  let component: MessageSaveButtonComponent;
  let fixture: ComponentFixture<MessageSaveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSaveButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

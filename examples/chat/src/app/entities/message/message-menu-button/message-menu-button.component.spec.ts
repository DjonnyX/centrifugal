import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMenuButtonComponent } from './message-menu-button.component';

describe('MessageMenuButtonComponent', () => {
  let component: MessageMenuButtonComponent;
  let fixture: ComponentFixture<MessageMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageMenuButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageGroupComponent } from './message-group.component';

describe('MessageGroupComponent', () => {
  let component: MessageGroupComponent;
  let fixture: ComponentFixture<MessageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

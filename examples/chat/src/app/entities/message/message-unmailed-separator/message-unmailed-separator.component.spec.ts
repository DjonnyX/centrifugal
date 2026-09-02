import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageUnmailedSeparatorComponent } from './message-unmailed-separator.component';

describe('MessageUnmailedSeparatorComponent', () => {
  let component: MessageUnmailedSeparatorComponent;
  let fixture: ComponentFixture<MessageUnmailedSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageUnmailedSeparatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageUnmailedSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

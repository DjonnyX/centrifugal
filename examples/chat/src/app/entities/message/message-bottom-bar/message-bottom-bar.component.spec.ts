import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBottomBarComponent } from './message-bottom-bar.component';

describe('MessageBottomBarComponent', () => {
  let component: MessageBottomBarComponent;
  let fixture: ComponentFixture<MessageBottomBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageBottomBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageBottomBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

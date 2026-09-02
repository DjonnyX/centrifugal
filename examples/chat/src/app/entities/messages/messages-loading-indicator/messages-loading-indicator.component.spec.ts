import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesLoadingIndicatorComponent } from './messages-loading-indicator.component';

describe('MessagesLoadingIndicatorComponent', () => {
  let component: MessagesLoadingIndicatorComponent;
  let fixture: ComponentFixture<MessagesLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

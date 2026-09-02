import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSubstrateComponent } from './message-substrate.component';

describe('MessageSubstrateComponent', () => {
  let component: MessageSubstrateComponent;
  let fixture: ComponentFixture<MessageSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

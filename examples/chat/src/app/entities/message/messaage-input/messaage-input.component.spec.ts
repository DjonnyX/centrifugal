import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaageInputComponent } from './messaage-input.component';

describe('MessaageInputComponent', () => {
  let component: MessaageInputComponent;
  let fixture: ComponentFixture<MessaageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessaageInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessaageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

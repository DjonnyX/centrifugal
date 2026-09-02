import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteContentComponent } from './dialog-delete-content.component';

describe('DialogDeleteContentComponent', () => {
  let component: DialogDeleteContentComponent;
  let fixture: ComponentFixture<DialogDeleteContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

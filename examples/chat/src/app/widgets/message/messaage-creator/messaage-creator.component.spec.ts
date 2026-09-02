import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaageCreatorComponent } from './messaage-creator.component';

describe('MessaageCreatorComponent', () => {
  let component: MessaageCreatorComponent;
  let fixture: ComponentFixture<MessaageCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessaageCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessaageCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

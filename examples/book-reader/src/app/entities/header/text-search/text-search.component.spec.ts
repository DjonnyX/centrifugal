import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSearchComponent } from './text-search.component';

describe('TextSearchComponent', () => {
  let component: TextSearchComponent;
  let fixture: ComponentFixture<TextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

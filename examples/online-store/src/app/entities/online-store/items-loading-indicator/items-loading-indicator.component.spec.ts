import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsLoadingIndicatorComponent } from './items-loading-indicator.component';

describe('ItemsLoadingIndicatorComponent', () => {
  let component: ItemsLoadingIndicatorComponent;
  let fixture: ComponentFixture<ItemsLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

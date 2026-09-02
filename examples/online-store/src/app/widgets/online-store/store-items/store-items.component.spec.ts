import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemsComponent } from './store-items.component';

describe('StoreItemsComponent', () => {
  let component: StoreItemsComponent;
  let fixture: ComponentFixture<StoreItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

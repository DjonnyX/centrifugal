import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBoxComponent } from './item-box.component';

describe('ItemBoxComponent', () => {
  let component: ItemBoxComponent;
  let fixture: ComponentFixture<ItemBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

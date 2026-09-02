import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubstrateComponent } from './item-substrate.component';

describe('ItemSubstrateComponent', () => {
  let component: ItemSubstrateComponent;
  let fixture: ComponentFixture<ItemSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

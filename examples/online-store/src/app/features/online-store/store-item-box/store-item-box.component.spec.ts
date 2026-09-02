import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemBoxComponent } from './store-item-box.component';

describe('StoreItemBoxComponent', () => {
  let component: StoreItemBoxComponent;
  let fixture: ComponentFixture<StoreItemBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreItemBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreItemBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

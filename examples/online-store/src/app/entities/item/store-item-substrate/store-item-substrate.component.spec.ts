import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemSubstrateComponent } from './store-item-substrate.component';

describe('StoreItemSubstrateComponent', () => {
  let component: StoreItemSubstrateComponent;
  let fixture: ComponentFixture<StoreItemSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreItemSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreItemSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

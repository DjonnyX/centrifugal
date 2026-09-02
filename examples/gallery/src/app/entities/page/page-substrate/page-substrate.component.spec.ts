import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSubstrateComponent } from './page-substrate.component';

describe('PageSubstrateComponent', () => {
  let component: PageSubstrateComponent;
  let fixture: ComponentFixture<PageSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

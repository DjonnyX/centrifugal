import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoadingIndicatorComponent } from './page-loading-indicator.component';

describe('PageLoadingIndicatorComponent', () => {
  let component: PageLoadingIndicatorComponent;
  let fixture: ComponentFixture<PageLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

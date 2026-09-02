import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsLoadingIndicatorComponent } from './groups-loading-indicator.component';

describe('GroupsLoadingIndicatorComponent', () => {
  let component: GroupsLoadingIndicatorComponent;
  let fixture: ComponentFixture<GroupsLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsLoadingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReleaseCommentsComponent } from './view-release-comments.component';

describe('ViewReleaseCommentsComponent', () => {
  let component: ViewReleaseCommentsComponent;
  let fixture: ComponentFixture<ViewReleaseCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReleaseCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReleaseCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

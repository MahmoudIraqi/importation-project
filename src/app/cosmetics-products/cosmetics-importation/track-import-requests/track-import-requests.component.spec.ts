import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackImportRequestsComponent } from './track-import-requests.component';

describe('TrackImportRequestsComponent', () => {
  let component: TrackImportRequestsComponent;
  let fixture: ComponentFixture<TrackImportRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackImportRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackImportRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

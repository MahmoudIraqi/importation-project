import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftImportRequestsComponent } from './draft-import-requests.component';

describe('DraftImportRequestsComponent', () => {
  let component: DraftImportRequestsComponent;
  let fixture: ComponentFixture<DraftImportRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftImportRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftImportRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

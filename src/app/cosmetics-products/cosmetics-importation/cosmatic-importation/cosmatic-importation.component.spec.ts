import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmaticImportationComponent } from './cosmatic-importation.component';

describe('CosmaticImportationComponent', () => {
  let component: CosmaticImportationComponent;
  let fixture: ComponentFixture<CosmaticImportationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosmaticImportationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosmaticImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

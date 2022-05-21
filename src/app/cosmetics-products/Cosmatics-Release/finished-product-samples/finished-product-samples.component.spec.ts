import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedProductSamplesComponent } from './finished-product-samples.component';

describe('FinishedProductSamplesComponent', () => {
  let component: FinishedProductSamplesComponent;
  let fixture: ComponentFixture<FinishedProductSamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedProductSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedProductSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremixListComponent } from './premix-list.component';

describe('PremixListComponent', () => {
  let component: PremixListComponent;
  let fixture: ComponentFixture<PremixListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremixListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditPremixComponent } from './create-or-edit-premix.component';

describe('CreateOrEditPremixComponent', () => {
  let component: CreateOrEditPremixComponent;
  let fixture: ComponentFixture<CreateOrEditPremixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditPremixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditPremixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

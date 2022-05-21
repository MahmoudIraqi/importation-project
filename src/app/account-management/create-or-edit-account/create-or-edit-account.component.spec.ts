import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditAccountComponent } from './create-or-edit-account.component';

describe('CreateOrEditAccountComponent', () => {
  let component: CreateOrEditAccountComponent;
  let fixture: ComponentFixture<CreateOrEditAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

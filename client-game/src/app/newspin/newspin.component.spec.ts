import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspinComponent } from './newspin.component';

describe('NewspinComponent', () => {
  let component: NewspinComponent;
  let fixture: ComponentFixture<NewspinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewspinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

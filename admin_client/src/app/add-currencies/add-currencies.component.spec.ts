import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrenciesComponent } from './add-currencies.component';

describe('AddCurrenciesComponent', () => {
  let component: AddCurrenciesComponent;
  let fixture: ComponentFixture<AddCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCurrenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

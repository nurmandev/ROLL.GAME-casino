import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyInfoComponent } from './currency-info.component';

describe('CurrencyInfoComponent', () => {
  let component: CurrencyInfoComponent;
  let fixture: ComponentFixture<CurrencyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

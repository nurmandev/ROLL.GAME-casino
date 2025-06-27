import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositHistoryComponent } from './deposit-history.component';

describe('DepositHistoryComponent', () => {
  let component: DepositHistoryComponent;
  let fixture: ComponentFixture<DepositHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

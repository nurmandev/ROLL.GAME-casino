import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinflipHistoryComponent } from './coinflip-history.component';

describe('CoinflipHistoryComponent', () => {
  let component: CoinflipHistoryComponent;
  let fixture: ComponentFixture<CoinflipHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinflipHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinflipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

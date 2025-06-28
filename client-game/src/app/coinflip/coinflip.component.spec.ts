import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinflipComponent } from './coinflip.component';

describe('CoinflipComponent', () => {
  let component: CoinflipComponent;
  let fixture: ComponentFixture<CoinflipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinflipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinflipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

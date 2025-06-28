import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceHistoryComponent } from './dice-history.component';

describe('DiceHistoryComponent', () => {
  let component: DiceHistoryComponent;
  let fixture: ComponentFixture<DiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

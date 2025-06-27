import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceComponent } from './dice.component';

describe('DiceComponent', () => {
  let component: DiceComponent;
  let fixture: ComponentFixture<DiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

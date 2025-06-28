import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListInfoComponent } from './game-list-info.component';

describe('GameListInfoComponent', () => {
  let component: GameListInfoComponent;
  let fixture: ComponentFixture<GameListInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameListInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

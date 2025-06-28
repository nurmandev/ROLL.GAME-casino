import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameinnerComponent } from './gameinner.component';

describe('GameinnerComponent', () => {
  let component: GameinnerComponent;
  let fixture: ComponentFixture<GameinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

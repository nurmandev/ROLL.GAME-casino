import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesComponent } from './mines.component';

describe('MinesComponent', () => {
  let component: MinesComponent;
  let fixture: ComponentFixture<MinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

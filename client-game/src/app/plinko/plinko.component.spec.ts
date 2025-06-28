import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlinkoComponent } from './plinko.component';

describe('PlinkoComponent', () => {
  let component: PlinkoComponent;
  let fixture: ComponentFixture<PlinkoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlinkoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlinkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

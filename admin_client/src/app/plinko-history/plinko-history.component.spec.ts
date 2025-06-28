import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlinkoHistoryComponent } from './plinko-history.component';

describe('PlinkoHistoryComponent', () => {
  let component: PlinkoHistoryComponent;
  let fixture: ComponentFixture<PlinkoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlinkoHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlinkoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

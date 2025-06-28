import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelHistoryComponent } from './wheel-history.component';

describe('WheelHistoryComponent', () => {
  let component: WheelHistoryComponent;
  let fixture: ComponentFixture<WheelHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WheelHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

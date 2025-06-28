import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimboHistoryComponent } from './limbo-history.component';

describe('LimboHistoryComponent', () => {
  let component: LimboHistoryComponent;
  let fixture: ComponentFixture<LimboHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimboHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimboHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

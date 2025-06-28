import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortuneHistoryComponent } from './fortune-history.component';

describe('FortuneHistoryComponent', () => {
  let component: FortuneHistoryComponent;
  let fixture: ComponentFixture<FortuneHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortuneHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FortuneHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

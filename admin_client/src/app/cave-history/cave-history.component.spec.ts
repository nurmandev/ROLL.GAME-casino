import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaveHistoryComponent } from './cave-history.component';

describe('CaveHistoryComponent', () => {
  let component: CaveHistoryComponent;
  let fixture: ComponentFixture<CaveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

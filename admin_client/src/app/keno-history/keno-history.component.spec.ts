import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KenoHistoryComponent } from './keno-history.component';

describe('KenoHistoryComponent', () => {
  let component: KenoHistoryComponent;
  let fixture: ComponentFixture<KenoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KenoHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KenoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

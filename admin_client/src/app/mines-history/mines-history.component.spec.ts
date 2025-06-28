import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesHistoryComponent } from './mines-history.component';

describe('MinesHistoryComponent', () => {
  let component: MinesHistoryComponent;
  let fixture: ComponentFixture<MinesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinesHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

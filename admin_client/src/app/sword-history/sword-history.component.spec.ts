import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwordHistoryComponent } from './sword-history.component';

describe('SwordHistoryComponent', () => {
  let component: SwordHistoryComponent;
  let fixture: ComponentFixture<SwordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

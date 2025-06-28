import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriesComponent } from './histories.component';

describe('HistoriesComponent', () => {
  let component: HistoriesComponent;
  let fixture: ComponentFixture<HistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

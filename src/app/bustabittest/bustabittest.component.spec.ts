import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BustabitTestComponent } from './bustabittest.component';

describe('BustabitTestComponent', () => {
  let component: BustabitTestComponent;
  let fixture: ComponentFixture<BustabitTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BustabitTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BustabitTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

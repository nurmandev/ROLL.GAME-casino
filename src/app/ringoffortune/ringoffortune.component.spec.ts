import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingoffortuneComponent } from './ringoffortune.component';

describe('RingoffortuneComponent', () => {
  let component: RingoffortuneComponent;
  let fixture: ComponentFixture<RingoffortuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RingoffortuneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RingoffortuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

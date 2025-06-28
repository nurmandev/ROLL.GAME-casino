import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawInfoComponent } from './withdraw-info.component';

describe('WithdrawInfoComponent', () => {
  let component: WithdrawInfoComponent;
  let fixture: ComponentFixture<WithdrawInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

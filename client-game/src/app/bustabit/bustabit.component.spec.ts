import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BustabitComponent } from './bustabit.component';

describe('BustabitComponent', () => {
  let component: BustabitComponent;
  let fixture: ComponentFixture<BustabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BustabitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BustabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

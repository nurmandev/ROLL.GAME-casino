import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwordComponent } from './sword.component';

describe('SwordComponent', () => {
  let component: SwordComponent;
  let fixture: ComponentFixture<SwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

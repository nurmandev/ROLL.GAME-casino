import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivesessionComponent } from './activesession.component';

describe('ActivesessionComponent', () => {
  let component: ActivesessionComponent;
  let fixture: ComponentFixture<ActivesessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivesessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivesessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndermaintainComponent } from './undermaintain.component';

describe('UndermaintainComponent', () => {
  let component: UndermaintainComponent;
  let fixture: ComponentFixture<UndermaintainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndermaintainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndermaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGameinfoComponent } from './user-gameinfo.component';

describe('UserGameinfoComponent', () => {
  let component: UserGameinfoComponent;
  let fixture: ComponentFixture<UserGameinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGameinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGameinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

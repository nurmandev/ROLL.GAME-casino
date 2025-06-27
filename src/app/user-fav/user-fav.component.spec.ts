import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavComponent } from './user-fav.component';

describe('UserFavComponent', () => {
  let component: UserFavComponent;
  let fixture: ComponentFixture<UserFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

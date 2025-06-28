import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprivacyComponent } from './myprivacy.component';

describe('MyprivacyComponent', () => {
  let component: MyprivacyComponent;
  let fixture: ComponentFixture<MyprivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyprivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyprivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

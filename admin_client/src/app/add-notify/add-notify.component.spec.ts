import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotifyComponent } from './add-notify.component';

describe('AddNotifyComponent', () => {
  let component: AddNotifyComponent;
  let fixture: ComponentFixture<AddNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

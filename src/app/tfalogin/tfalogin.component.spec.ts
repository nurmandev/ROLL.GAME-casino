import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaloginComponent } from './tfalogin.component';

describe('TfaloginComponent', () => {
  let component: TfaloginComponent;
  let fixture: ComponentFixture<TfaloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfaloginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfaloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

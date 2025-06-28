import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipInfoComponent } from './vip-info.component';

describe('VipInfoComponent', () => {
  let component: VipInfoComponent;
  let fixture: ComponentFixture<VipInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

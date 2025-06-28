import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoComponent } from './casino.component';

describe('CasinoComponent', () => {
  let component: CasinoComponent;
  let fixture: ComponentFixture<CasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

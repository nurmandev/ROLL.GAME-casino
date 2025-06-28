import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaveofplunderComponent } from './caveofplunder.component';

describe('CaveofplunderComponent', () => {
  let component: CaveofplunderComponent;
  let fixture: ComponentFixture<CaveofplunderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaveofplunderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaveofplunderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsViewComponent } from './cms-view.component';

describe('CmsViewComponent', () => {
  let component: CmsViewComponent;
  let fixture: ComponentFixture<CmsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

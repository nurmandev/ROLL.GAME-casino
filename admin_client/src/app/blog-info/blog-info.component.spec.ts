import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogInfoComponent } from './blog-info.component';

describe('BlogInfoComponent', () => {
  let component: BlogInfoComponent;
  let fixture: ComponentFixture<BlogInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

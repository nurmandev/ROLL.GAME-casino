import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerheaderComponent } from './innerheader.component';

describe('InnerheaderComponent', () => {
  let component: InnerheaderComponent;
  let fixture: ComponentFixture<InnerheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

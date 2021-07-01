import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTvShowComponent } from './add-tv-show.component';

describe('AddTvShowComponent', () => {
  let component: AddTvShowComponent;
  let fixture: ComponentFixture<AddTvShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTvShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTvShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvShowProfileComponent } from './tv-show-profile.component';

describe('TvShowProfileComponent', () => {
  let component: TvShowProfileComponent;
  let fixture: ComponentFixture<TvShowProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvShowProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvShowProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

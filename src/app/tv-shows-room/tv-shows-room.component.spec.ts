import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvShowsRoomComponent } from './tv-shows-room.component';

describe('TvShowsRoomComponent', () => {
  let component: TvShowsRoomComponent;
  let fixture: ComponentFixture<TvShowsRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvShowsRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvShowsRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

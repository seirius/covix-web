import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesRoomComponent } from './movies-room.component';

describe('MoviesRoomComponent', () => {
  let component: MoviesRoomComponent;
  let fixture: ComponentFixture<MoviesRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

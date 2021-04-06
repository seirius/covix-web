import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveRoomsComponent } from './live-rooms.component';

describe('LiveRoomsComponent', () => {
  let component: LiveRoomsComponent;
  let fixture: ComponentFixture<LiveRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

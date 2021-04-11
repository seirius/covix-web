import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentFeedComponent } from './torrent-feed.component';

describe('TorrentFeedComponent', () => {
  let component: TorrentFeedComponent;
  let fixture: ComponentFixture<TorrentFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

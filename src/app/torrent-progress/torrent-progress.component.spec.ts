import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentProgressComponent } from './torrent-progress.component';

describe('TorrentProgressComponent', () => {
  let component: TorrentProgressComponent;
  let fixture: ComponentFixture<TorrentProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

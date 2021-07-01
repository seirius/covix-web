import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddTrackComponent } from './add-track/add-track.component';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
import { MovieComponent } from './movie/movie.component';
import { SocketModule } from './socketio/socket.module';
import { UserListComponent } from './user-list/user-list.component';
import { VideoJsComponent } from './video-js/video-js.component';
import { VideoComponent } from './video/video.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { UserGuard } from "./user-selection/user-guard.service";
import { LiveRoomsComponent } from './live-rooms/live-rooms.component';
import { TorrentFeedComponent } from './torrent-feed/torrent-feed.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TfItemComponent } from './torrent-feed/tf-item/tf-item.component';
import { TorrentListComponent } from './torrent-list/torrent-list.component';
import { TorrentProgressComponent } from './torrent-progress/torrent-progress.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { TvShowListComponent } from './tv-show-list/tv-show-list.component';
import { TvShowComponent } from './tv-show/tv-show.component';
import { TvShowProfileComponent } from './tv-show-profile/tv-show-profile.component';
import { AddTvShowComponent } from './add-tv-show/add-tv-show.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MoviesRoomComponent } from './movies-room/movies-room.component';
import { TvShowsRoomComponent } from './tv-shows-room/tv-shows-room.component';


@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoJsComponent,
    UserListComponent,
    AddTrackComponent,
    AddMovieComponent,
    MovieComponent,
    MovieProfileComponent,
    MovieListComponent,
    UserSelectionComponent,
    LiveRoomsComponent,
    TorrentFeedComponent,
    PaginationComponent,
    TfItemComponent,
    TorrentListComponent,
    TorrentProgressComponent,
    SearchInputComponent,
    TvShowListComponent,
    TvShowComponent,
    TvShowProfileComponent,
    AddTvShowComponent,
    MoviesRoomComponent,
    TvShowsRoomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketModule,
    ApiModule
  ],
  providers: [DataService, UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

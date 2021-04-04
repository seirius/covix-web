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
import { JoinRoomComponent } from './join-room/join-room.component';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
import { MovieComponent } from './movie/movie.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { SocketModule } from './socketio/socket.module';
import { UserListComponent } from './user-list/user-list.component';
import { VideoJsComponent } from './video-js/video-js.component';
import { VideoJoinGuard } from './video/video-join-guard.service';
import { VideoComponent } from './video/video.component';
import { MovieListComponent } from './movie-list/movie-list.component';


@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoJsComponent,
    NewRoomComponent,
    JoinRoomComponent,
    UserListComponent,
    AddTrackComponent,
    AddMovieComponent,
    MovieComponent,
    MovieProfileComponent,
    MovieListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketModule,
    ApiModule
  ],
  providers: [DataService, VideoJoinGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

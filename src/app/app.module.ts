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
    LiveRoomsComponent
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
  providers: [DataService, UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

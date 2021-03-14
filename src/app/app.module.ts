import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoComponent } from './video/video.component';
import { VideoJsComponent } from './video-js/video-js.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewRoomComponent } from './new-room/new-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { SocketModule } from './socketio/socket.module';
import { DataService } from './data.service';
import { UserListComponent } from './user-list/user-list.component';
import { VideoJoinGuard } from './video/video-join-guard.service';
import { AddTrackComponent } from './add-track/add-track.component';
import { RoomService } from './video/room.service';

@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoJsComponent,
    NewRoomComponent,
    JoinRoomComponent,
    UserListComponent,
    AddTrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketModule
  ],
  providers: [DataService, VideoJoinGuard, RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }

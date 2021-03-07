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

@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoJsComponent,
    NewRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

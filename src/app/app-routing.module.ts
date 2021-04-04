import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { VideoJoinGuard } from './video/video-join-guard.service';
import { VideoComponent } from './video/video.component';


const routes: Routes = [
    {
        path: "",
        redirectTo: "/new-room",
        pathMatch: "full"
    },
    {
        path: "new-room",
        component: NewRoomComponent
    },
    {
        path: "join-room",
        component: JoinRoomComponent
    },
    {
        path: "video",
        component: VideoComponent,
        canActivate: [VideoJoinGuard]
    },
    {
        path: "add-movie",
        component: AddMovieComponent
    },
    {
        path: "movie",
        component: MovieProfileComponent
    },
    {
        path: "movies",
        component: MovieListComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

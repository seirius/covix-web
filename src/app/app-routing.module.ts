import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddTvShowComponent } from './add-tv-show/add-tv-show.component';
import { LiveRoomsComponent } from './live-rooms/live-rooms.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
import { MoviesRoomComponent } from './movies-room/movies-room.component';
import { TorrentFeedComponent } from './torrent-feed/torrent-feed.component';
import { TorrentListComponent } from './torrent-list/torrent-list.component';
import { TvShowListComponent } from './tv-show-list/tv-show-list.component';
import { TvShowProfileComponent } from './tv-show-profile/tv-show-profile.component';
import { TvShowsRoomComponent } from './tv-shows-room/tv-shows-room.component';
import { UserGuard } from './user-selection/user-guard.service';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { VideoComponent } from './video/video.component';


const routes: Routes = [
    {
        path: "",
        redirectTo: "/movies",
        pathMatch: "full",
        canActivate: [UserGuard]
    },
    {
        path: "movies-room",
        component: MoviesRoomComponent,
        canActivate: [UserGuard]
    },
    {
        path: "tv-shows-room",
        component: TvShowsRoomComponent,
        canActivate: [UserGuard]
    },
    {
        path: "add-movie",
        component: AddMovieComponent,
        canActivate: [UserGuard]
    },
    {
        path: "movie",
        component: MovieProfileComponent,
        canActivate: [UserGuard]
    },
    {
        path: "movies",
        component: MovieListComponent,
        canActivate: [UserGuard]
    },
    {
        path: "live-rooms",
        component: LiveRoomsComponent,
        canActivate: [UserGuard]
    },
    {
        path: "torrent-feed",
        component: TorrentFeedComponent,
        canActivate: [UserGuard]
    },
    {
        path: "torrent-list",
        component: TorrentListComponent,
        canActivate: [UserGuard]
    },
    {
        path: "users",
        component: UserSelectionComponent
    },
    {
        path: "tv-shows",
        component: TvShowListComponent,
        canActivate: [UserGuard]
    },
    {
        path: "tv-show",
        component: TvShowProfileComponent,
        canActivate: [UserGuard]
    },
    {
        path: "add-tv-show",
        component: AddTvShowComponent,
        canActivate: [UserGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

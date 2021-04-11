import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { LiveRoomsComponent } from './live-rooms/live-rooms.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
import { TorrentFeedComponent } from './torrent-feed/torrent-feed.component';
import { TorrentListComponent } from './torrent-list/torrent-list.component';
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
        path: "video",
        component: VideoComponent,
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

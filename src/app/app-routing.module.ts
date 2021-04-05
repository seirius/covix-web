import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieProfileComponent } from './movie-profile/movie-profile.component';
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
        path: "users",
        component: UserSelectionComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

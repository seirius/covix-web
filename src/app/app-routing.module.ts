import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinRoomComponent } from './join-room/join-room.component';
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

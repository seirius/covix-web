import { NgModule } from "@angular/core";
import { FileService } from "./file.service";
import { MediaService } from "./media.service";
import { MovieService } from "./movie.service";
import { RoomService } from "./room.service";
import { UserService } from "./user.service";

@NgModule({
    providers: [
        FileService,
        MediaService,
        MovieService,
        RoomService,
        UserService
    ]
})
export class ApiModule {}
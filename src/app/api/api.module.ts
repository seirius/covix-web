import { NgModule } from "@angular/core";
import { FileService } from "./file.service";
import { MediaService } from "./media.service";
import { MovieService } from "./movie.service";
import { RoomService } from "./room.service";

@NgModule({
    providers: [
        FileService,
        MediaService,
        MovieService,
        RoomService
    ]
})
export class ApiModule {}
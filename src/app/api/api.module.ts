import { NgModule } from "@angular/core";
import { FileService } from "./file.service";
import { MediaSourceService } from "./media-source.service";
import { MediaService } from "./media.service";
import { MovieService } from "./movie.service";
import { RoomService } from "./room.service";
import { TorrentClientService } from "./torrent-client.service";
import { TorrentFeedService } from "./torrent-feed.service";
import { UserService } from "./user.service";

@NgModule({
    providers: [
        FileService,
        MediaService,
        MovieService,
        RoomService,
        UserService,
        TorrentFeedService,
        TorrentClientService,
        MediaSourceService
    ]
})
export class ApiModule {}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MediaResponse } from "./media.service";
import { TorrentResponse } from "./torrent-client.service";

@Injectable()
export class MediaSourceService {

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public getMediaByTorrent(id: string): Promise<MediaResponse> {
        return this.httpClient
        .get<MediaResponse>("/api/media-source/media-by-torrent", {
            params: { id }
        })
        .toPromise();
    }

    public getTorrentByMedia(id: string): Promise<TorrentResponse> {
        return this.httpClient
        .get<TorrentResponse>("/api/media-source/torrent-by-media", {
            params: { id }
        })
        .toPromise();
    }

}
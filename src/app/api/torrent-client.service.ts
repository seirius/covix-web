import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MovieResponse } from "./movie.service";

export enum TorrentState {
    DONWLOADING = "downloading",
    START = "start",
    DONE = "done",
    ERROR = "error"
}

export interface TorrentResponse {
    id: string;
    infoHash: string;
    name: string;
    progress: number;
    state: TorrentState;
    speed: number;
    fileId: string;
}

@Injectable()
export class TorrentClientService {

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public getTorrents(): Promise<TorrentResponse[]> {
        return this.httpClient
        .get<TorrentResponse[]>("/api/torrent-client/list")
        .toPromise();
    }

}
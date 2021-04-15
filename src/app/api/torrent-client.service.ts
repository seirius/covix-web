import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export enum TorrentState {
    DONWLOADING = "downloading",
    START = "start",
    DONE = "done",
    PAUSED = "paused",
    ERROR = "error"
}

export interface TorrentResponse {
    id: string;
    infoHash: string;
    name: string;
    progress: number;
    state: TorrentState;
    speed: number;
    feed: string;
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

    public deleteTorrent(id: string): Promise<void> {
        return this.httpClient
        .delete<void>("/api/torrent-client", {
            params: { id }
        })
        .toPromise();
    }

    public pauseTorrent(id: string): Promise<void> {
        return this.httpClient
        .put<void>(`/api/torrent-client/state/${id}/pause`, {})
        .toPromise();
    }

    public resumeTorrent(id: string): Promise<void> {
        return this.httpClient
        .put<void>(`/api/torrent-client/state/${id}/resume`, {})
        .toPromise();
    }

}
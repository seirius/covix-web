import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FileResponse } from "./file.service";

export interface MediaResponse {
    id: string;
    file: FileResponse;
    tracks?: FileResponse[];
}

@Injectable()
export class MediaService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public getMedia(mediaId: string): Promise<MediaResponse> {
        return this.httpClient
        .get<MediaResponse>(`api/media/${mediaId}`)
        .toPromise();
    }

    public addTrack(mediaId: string, trackName: string): Promise<void> {
        return this.httpClient
        .put<void>(`api/media/${mediaId}/track`, { trackName })
        .toPromise();
    }

}
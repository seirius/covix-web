import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MediaResponse } from "./media.service";
import { MovieResponse } from "./movie.service";
import { SeasonResponse, TvShowResponse } from "./tv-show.service";

export interface RoomResponse {
    roomId: string;
    usernames: string[];
    owner: string;
    lastTimeWatched: Date;
}

export interface RoomDto {
    roomId: string;
    users: string[];
    currentTime: number;
    mediaId: string;
}

export interface RoomWithMediaResponse {
    roomId: string;
    mediaLabel: string;
    usernames: string[];
}

export interface TvShowForRoom {
    tvShow: TvShowResponse;
    season: SeasonResponse;
    media: MediaResponse;
    room: RoomResponse;
}

@Injectable()
export class RoomService {

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public getRoom(roomId: string): Promise<RoomDto> {
        return this.httpClient
        .get<RoomDto>(`/api/room`, {
            params: { id: roomId }
        })
        .toPromise();
    }

    public getUsers(roomId: string): Promise<string[]> {
        return this.httpClient
        .get<string[]>(`${roomId}/users`)
        .toPromise();
    }

    public newRoom(mediaId: string, username: string): Promise<RoomResponse> {
        return this.httpClient
        .post<RoomResponse>(`/api/room`, { mediaId, username })
        .toPromise();
    }

    public getLiveRooms(): Promise<RoomWithMediaResponse[]> {
        return this.httpClient
        .get<RoomWithMediaResponse[]>("/api/room/live")
        .toPromise();
    }

    public getMovieInRoom(id: string): Promise<MovieResponse> {
        return this.httpClient
        .get<MovieResponse>("/api/room/movie", { params: { id } })
        .toPromise();
    }

    public getTvShowInRoom(id: string): Promise<TvShowForRoom> {
        return this.httpClient
        .get<TvShowForRoom>("/api/room/tv-show", { params: { id }})
        .toPromise();
    }

}
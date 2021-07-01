import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MediaResponse } from "./media.service";
import { UserResponse } from "./user.service";

export interface TvShowResponse {
    id: string;
    label: string;
    iconUrl?: string;
    icon?: string;
    seasons?: SeasonResponse[];
}

export interface CreateShowArgs {
    label: string;
    iconUrl?: string;
    icon?: string;
}

export interface CreateEmptySeasonArgs {
    tvShowId: string;
    seasonLabel: string;
    index?: number;
}

export interface TvShowListResponse {
    tvShows: TvShowResponse[];
    totalCount: number;
}

export interface SeasonResponse {
    id: string;
    label: string;
    tvShowId: string;
    index: number;
    medias?: MediaResponse[];
}

export interface AddEpisodeArgs {
    seasonId: string;
    filename: string;
    index?: number;
}

export class AddShowTrackerArgs {
    username: string;
    tvShowId: string;
    mediaId: string;
}

export interface ShowTrackerResponse {
    user: UserResponse;
    tvShow: TvShowResponse;
    media: MediaResponse;
}

export interface GetTvShows {
    query?: string;
    currentPage?: string;
    perPage?: string;
}

export interface UpdateTvShowArgs {
    label?: string;
    iconUrl?: string;
    icon?: string;
}

export interface RemoveEpisodeArgs {
    seasonId: string;
    mediaId: string;
}

export interface UpdateEpisodeIndex {
    mediaId: string;
    index: number;
}

export interface UpdateSeasonIndexArgs {
    seasonId: string;
    index: number;
}

@Injectable()
export class TvShowService {

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public createTvShow(args: CreateShowArgs): Promise<TvShowResponse> {
        return this.httpClient
        .post<TvShowResponse>("/api/tv-show", args)
        .toPromise();
    }

    public deleteTvShow(id: string): Promise<void> {
        return this.httpClient
        .delete<void>("/api/tv-show", { params: { id }})
        .toPromise();
    }

    public getTvShows(args: GetTvShows = {}): Promise<TvShowListResponse> {
        return this.httpClient
        .get<TvShowListResponse>("/api/tv-show/list", { params: args as any })
        .toPromise();
    }

    public updateTvShow(id: string, args: UpdateTvShowArgs): Promise<TvShowResponse> {
        return this.httpClient
        .put<TvShowResponse>("/api/tv-show", args, { params: { id }})
        .toPromise();
    }

    public getTvShow(id: string): Promise<TvShowResponse> {
        return this.httpClient
        .get<TvShowResponse>("/api/tv-show", { params: { id } })
        .toPromise();
    }

    public getSeasons(id: string): Promise<SeasonResponse[]> {
        return this.httpClient
        .get<SeasonResponse[]>("/api/tv-show/seasons", { params: { id }})
        .toPromise();
    }

    public addSeason(args: CreateEmptySeasonArgs): Promise<SeasonResponse> {
        return this.httpClient
        .post<SeasonResponse>("/api/tv-show/season", args)
        .toPromise();
    }

    public deleteSeason(seasonId: string): Promise<TvShowResponse> {
        return this.httpClient
        .delete<TvShowResponse>("/api/tv-show/season", { params: { seasonId }})
        .toPromise();
    }

    public addEpisode(args: AddEpisodeArgs): Promise<SeasonResponse> {
        return this.httpClient
        .post<SeasonResponse>("/api/tv-show/season/episode", args)
        .toPromise();
    }

    public updateEpisodeIndex(args: UpdateEpisodeIndex): Promise<SeasonResponse> {
        return this.httpClient
        .put<SeasonResponse>("/api/tv-show/season/episode/index", args)
        .toPromise();
    }

    public removeEpisode(args: RemoveEpisodeArgs): Promise<SeasonResponse> {
        return this.httpClient
        .delete<SeasonResponse>("/api/tv-show/season/episode", { params: { seasonId: args.seasonId, mediaId: args.mediaId } })
        .toPromise();
    }

    public getEpisode(tvShowId: string, userId: string): Promise<MediaResponse> {
        return this.httpClient
        .get<MediaResponse>("/api/tv-show/season/episode", { params: { tvShowId, userId }})
        .toPromise();
    }

    public addShowTracker(args: AddShowTrackerArgs): Promise<ShowTrackerResponse> {
        return this.httpClient
        .post<ShowTrackerResponse>("/api/tv-show/show-tracker", args)
        .toPromise();
    }

    public updateSeasonIndex(args: UpdateSeasonIndexArgs): Promise<SeasonResponse> {
        return this.httpClient
        .put<SeasonResponse>("/api/tv-show/season/index", args)
        .toPromise();
    }

}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface MovieTfArgs {
    query: string;
    page: number;
    limit: number;
    sources: TfSource[];
}

export interface Feed {
    url: string;
    quality: string;
    size: string;
}

export interface MovieTf {
    label: string;
    icon: string;
    feeds: Feed[];
}

export enum TfSource {
    YTS = "yts"
}

export interface MovieTfResponse {
    movies: MovieTf[];
    totalCount: number;
}

@Injectable()
export class TorrentFeedService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public getMovies(args: MovieTfArgs): Promise<MovieTfResponse> {
        return this.httpClient
        .get<MovieTfResponse>("/api/torrent-feed/movies", {
            params: {
                query: args.query,
                limit: args.limit as any,
                page: args.page as any,
                ["sources[]"]: args.sources
            }
        })
        .toPromise();
    }

}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface AddMovieArgs {
    label: string;
    name: string;
    iconUrl?: string;
    icon?: string;
}

export interface MovieResponse {
    id: string;
    mediaId: string;
    filename: string;
    label: string;
    iconUrl?: string;
    icon?: string;
}

@Injectable()
export class MovieService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public addMovie(args: AddMovieArgs): Promise<MovieResponse> {
        return this.httpClient
        .post<MovieResponse>("/api/movie", args)
        .toPromise();
    }

    public getMovie(id: string): Promise<MovieResponse> {
        return this.httpClient
        .get<MovieResponse>(`/api/movie`, {
            params: { id }
        }).toPromise();
    }

    public getMovies(): Promise<MovieResponse[]> {
        return this.httpClient
        .get<MovieResponse[]>("/api/movie/list")
        .toPromise();
    }

    public deleteMovie(id: string): Promise<void> {
        return this.httpClient
        .delete<void>(`/api/movie/${id}`)
        .toPromise();
    }

}
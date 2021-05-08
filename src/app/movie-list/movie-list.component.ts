import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetMovies, MovieResponse, MovieService } from '../api/movie.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const DEFAULT = {
    CURRENT_PAGE: 1,
    PER_PAGE: 10,
    OFFSET: 3
};
@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

    public movies: MovieResponse[];

    public currentPage = DEFAULT.CURRENT_PAGE;
    private perPage = DEFAULT.PER_PAGE;

    private search: string;

    private totalCount: number;

    public pages = 0;
    public offset = DEFAULT.OFFSET;


    constructor(
        private readonly movieService: MovieService,
        private readonly router: Router,
        private readonly socketService: SocketService
    ) {
        this.init();
    }

    ngOnInit(): void {
        this.socketService.socket.on(EVENTS.MOVIE_DELETE, () => this.init());
    }

    private async execSearch(): Promise<void> {
        const query: GetMovies = {
            currentPage: this.currentPage.toString(),
            perPage: this.perPage.toString()
        };
        if (this.search?.trim()) {
            query.query = this.search;
        }
        const { movies, totalCount } = await this.movieService.getMovies(query);
        this.movies = movies;
        this.totalCount = totalCount;
        this.pages = Math.ceil(this.totalCount / this.perPage);
    }

    public async init(): Promise<void> {
        await this.execSearch();
        if (this.movies.length === 0) {
            await this.router.navigate(["/add-movie"]);
        }
    }

    public async onSearch(search: string): Promise<void> {
        if (search !== this.search) {
            this.movies = [];
            this.currentPage = DEFAULT.CURRENT_PAGE;
            this.perPage = DEFAULT.PER_PAGE;
        }
        this.search = search;
        await this.execSearch();
    }

    public async selectedPage(page: number): Promise<void> {
        this.currentPage = page;
        await this.execSearch();
    }

}

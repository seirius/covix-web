import { Component, OnInit } from '@angular/core';
import { MovieResponse, MovieService } from '../api/movie.service';

@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

    public movies: MovieResponse[];

    constructor(
        private readonly movieService: MovieService
    ) {
        this.init();
    }

    ngOnInit(): void {
    }

    public async init(): Promise<void> {
        this.movies = await this.movieService.getMovies();
    }

}

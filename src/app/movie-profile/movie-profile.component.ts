import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieResponse, MovieService } from '../api/movie.service';

@Component({
    selector: 'app-movie-profile',
    templateUrl: './movie-profile.component.html',
    styleUrls: ['./movie-profile.component.scss']
})
export class MovieProfileComponent implements OnInit {

    public movieResponse: MovieResponse;

    constructor(
        private readonly router: ActivatedRoute,
        private readonly movieService: MovieService
    ) {
        this.initMovie();
    }

    public initMovie(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.movieResponse = await this.movieService.getMovie(id);
            } else {
                alert("Not valid movie's id");
            }
        });
    }

    ngOnInit(): void {
    }

}

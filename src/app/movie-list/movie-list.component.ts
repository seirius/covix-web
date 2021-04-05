import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieResponse, MovieService } from '../api/movie.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

    public movies: MovieResponse[];

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

    public async init(): Promise<void> {
        this.movies = await this.movieService.getMovies();
        if (this.movies.length === 0) {
            await this.router.navigate(["/add-movie"]);
        }
    }

}

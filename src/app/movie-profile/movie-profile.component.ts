import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieResponse, MovieService } from '../api/movie.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

@Component({
    selector: 'app-movie-profile',
    templateUrl: './movie-profile.component.html',
    styleUrls: ['./movie-profile.component.scss']
})
export class MovieProfileComponent implements OnInit {

    public movieResponse: MovieResponse;

    constructor(
        private readonly router: ActivatedRoute,
        private readonly routerToMove: Router,
        private readonly movieService: MovieService,
        private readonly socketService: SocketService
    ) {
        this.initMovie();
    }

    public initMovie(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.movieResponse = await this.movieService.getMovie(id);
                if (!this.movieResponse) {
                    this.routerToMove.navigate(["/movies"]);
                } else {
                    this.socketService.socket.on(EVENTS.MOVIE_DELETE, (deletedId: string) => {
                        if (id === deletedId) {
                            this.routerToMove.navigate(["/movies"]);
                        }
                    });
                }
            } else {
                alert("Not valid movie's id");
            }
        });
    }

    ngOnInit(): void {
    }

}

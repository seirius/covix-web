import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieResponse } from '../api/movie.service';
import { RoomService } from '../api/room.service';

@Component({
    selector: 'app-movies-room',
    templateUrl: './movies-room.component.html',
    styleUrls: ['./movies-room.component.scss']
})
export class MoviesRoomComponent implements OnInit {

    public movie: MovieResponse;

    constructor(
        private router: ActivatedRoute,
        private readonly roomService: RoomService
    ) { }

    ngOnInit(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.movie = await this.roomService.getMovieInRoom(id);
            }
        });
    }

}

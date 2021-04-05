import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieResponse, MovieService } from '../api/movie.service';
import { RoomService } from '../api/room.service';
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

    public sure = false;

    @Input()
    public movie: MovieResponse;

    public icon = "https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png";

    constructor(
        private readonly router: Router,
        private readonly roomService: RoomService,
        private readonly movieService: MovieService,
        private readonly dataService: DataService
    ) {
    }

    ngOnInit(): void {
        if (this.movie.iconUrl) {
            this.icon = this.movie.iconUrl;
        }
        if (this.movie.icon) {
            this.icon = `/api/media/${this.movie.icon}/image`;
        }
    }

    public async watch(): Promise<void> {
        const room = await this.roomService.newRoom(this.movie.mediaId);
        this.dataService.roomId = room.roomId;
        await this.router.navigate(["/video"], { queryParams: { id: room.roomId } });
    }

    public askDelete(): void {
        this.sure = true;
    }

    public async delete(): Promise<void> {
        await this.movieService.deleteMovie(this.movie.id);
    }

}

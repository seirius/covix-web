import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieResponse } from '../api/movie.service';
import { RoomService } from '../api/room.service';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

    @Input()
    public movie: MovieResponse;

    constructor(
        private readonly router: Router,
        private readonly roomService: RoomService
    ) {
    }

    ngOnInit(): void {
    }

    public async watch(): Promise<void> {
        const room = await this.roomService.newRoom(this.movie.mediaId);
        await this.router.navigate(["/video"], { queryParams: { id: room.roomId } });
    }

}

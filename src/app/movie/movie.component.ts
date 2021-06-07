import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { MediaService } from '../api/media.service';
import { MovieResponse, MovieService } from '../api/movie.service';
import { RoomService } from '../api/room.service';
import { DataService } from '../data.service';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit, AfterViewInit {

    public sure = false;

    @Input()
    public movie: MovieResponse;

    @ViewChild(NgbDropdown)
    private dropdown: NgbDropdown;

    public icon = "https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png";

    constructor(
        private readonly router: Router,
        private readonly mediaService: MediaService,
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
    
    ngAfterViewInit(): void {
        this.dropdown.openChange.subscribe((state: boolean) => {
            if (!state && this.sure) {
                this.sure = false;
            }
        });
    }

    public async watch(): Promise<void> {
        const room = await this.roomService.newRoom(this.movie.mediaId, this.dataService.username);
        this.dataService.roomId = room.roomId;
        await this.router.navigate(["/video"], { queryParams: { id: room.roomId } });
    }

    public askDelete(): void {
        this.sure = true;
    }

    public async delete(): Promise<void> {
        await this.movieService.deleteMovie(this.movie.id);
        this.dropdown.close();
    }

    public async edit(): Promise<void> {
        await this.router.navigate(["/movie"], {
            queryParams: {
                id: this.movie.id
            }
        });
    }

    public download(): void {
        if (this.movie.filename) {
            this.mediaService.promptDownload(this.movie.filename);
        }
    }

}

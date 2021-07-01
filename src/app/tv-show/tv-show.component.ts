import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RoomService } from '../api/room.service';
import { TvShowResponse, TvShowService } from '../api/tv-show.service';
import { DataService } from '../data.service';

@Component({
    selector: 'app-tv-show',
    templateUrl: './tv-show.component.html',
    styleUrls: ['./tv-show.component.scss']
})
export class TvShowComponent implements OnInit, AfterViewInit {

    public sure = false;

    @Input()
    public tvShow: TvShowResponse;

    @ViewChild(NgbDropdown)
    private dropdown: NgbDropdown;

    public icon = "https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png";

    constructor(
        private readonly router: Router,
        private readonly tvShowService: TvShowService,
        private readonly dataService: DataService,
        private readonly roomService: RoomService
    ) { }

    ngOnInit(): void {
        if (this.tvShow.iconUrl) {
            this.icon = this.tvShow.iconUrl;
        }
        if (this.tvShow.icon) {
            this.icon = `/api/media/${this.tvShow.icon}/image`;
        }
    }

    private log(error: Error): void {
        alert(JSON.stringify(error, null, 4));
    }

    ngAfterViewInit(): void {
        this.dropdown.openChange.subscribe((state: boolean) => {
            if (!state && this.sure) {
                this.sure = false;
            }
        });
    }

    public async watch(): Promise<void> {
        try {
            const media = await this.tvShowService.getEpisode(this.tvShow.id, this.dataService.user.id);
            const room = await this.roomService.newRoom(media.id, this.dataService.user.username);
            this.dataService.roomId = room.roomId;
            await this.router.navigate(["/tv-shows-room"], { queryParams: { id: room.roomId }});
        } catch (error) {
            this.log(error);
        }
    }

    public askDelete(): void {
        this.sure = true;
    }

    public async delete(): Promise<void> {
        await this.tvShowService.deleteTvShow(this.tvShow.id);
        this.dropdown.close();
    }

    public async edit(): Promise<void> {
        await this.router.navigate(["/tv-show"], {
            queryParams: {
                id: this.tvShow.id
            }
        });
    }

}

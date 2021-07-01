import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaResponse } from '../api/media.service';
import { RoomService } from '../api/room.service';
import { SeasonResponse, TvShowResponse, TvShowService } from '../api/tv-show.service';
import { DataService } from '../data.service';
import { AnimaState } from '../util/animations';

@Component({
    selector: 'app-tv-shows-room',
    templateUrl: './tv-shows-room.component.html',
    styleUrls: ['./tv-shows-room.component.scss'],
    animations: [
        trigger('episodesState', [
            state(AnimaState.CLOSED, style({
                right: "-320px"
            })),
            state(AnimaState.OPEN, style({
                right: 0,
            })),
            transition('* => *', animate(150))
        ]),
    ]
})
export class TvShowsRoomComponent implements OnInit {

    public tvShow: TvShowResponse;
    public season: SeasonResponse;
    public seasons: SeasonResponse[];
    public media: MediaResponse;
    public episode: number;
    public hasPrevious = false;
    public hasNext = false;
    public videoOptionsState = AnimaState.CLOSED;
    public episodesState = AnimaState.CLOSED;

    constructor(
        private router: ActivatedRoute,
        private readonly navRouter: Router,
        private readonly roomService: RoomService,
        private readonly dataService: DataService,
        private readonly tvShowService: TvShowService
    ) {
    }

    private log(error: Error): void {
        console.error(error);
        alert(JSON.stringify(error.message, null, 4));
    }

    ngOnInit(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                try {
                    const { tvShow, season, media, room } = await this.roomService.getTvShowInRoom(id);
                    if (room.owner === this.dataService.user.username) {
                        await this.tvShowService.addShowTracker({
                            username: this.dataService.user.username,
                            mediaId: media.id,
                            tvShowId: tvShow.id
                        });
                    }
                    this.tvShow = tvShow;
                    this.season = season;
                    this.media = media;
                    this.episode = this.season.medias.findIndex(({ id: mediaId }) => mediaId === this.media.id);
                    this.hasPrevious = this.episode > 0;
                    this.hasNext = this.episode < this.season.medias.length - 1;
                } catch (error) {
                    this.log(error);
                }
            }
        });
    }

    private async goToByIndex(index: number): Promise<void> {
        await this.goTo(this.season.medias[index].id);
    }

    public async goTo(mediaId: string): Promise<void> {
        const room = await this.roomService
                    .newRoom(mediaId, this.dataService.user.username);
        await this.navRouter.navigateByUrl("/", { skipLocationChange: true });
        await this.navRouter.navigate(["/tv-shows-room"], { queryParams: { id: room.roomId }});
    }

    public async next(): Promise<void> {
        try {
            if (this.hasNext) {
                await this.goToByIndex(this.episode + 1);
            }
        } catch (error) {
            this.log(error);
        }
    }

    public async previous(): Promise<void> {
        try {
            if (this.hasPrevious) {
                await this.goToByIndex(this.episode - 1);
            }
        } catch (error) {
            this.log(error);
        }
    }

    public videoOptionsToggle(): void {
        this.videoOptionsState = this.videoOptionsState === AnimaState.CLOSED ? AnimaState.OPEN : AnimaState.CLOSED;
    }

    public onVideoOptionsChanges(state: AnimaState): void {
        this.videoOptionsState = state;
    }

    public toggleEpisodes(): void {
        this.episodesState = this.episodesState === AnimaState.CLOSED ? AnimaState.OPEN : AnimaState.CLOSED;
    }

    public async edit(): Promise<void> {
        await this.navRouter.navigate(["/tv-show"], { queryParams: { id: this.tvShow.id }});
    }

    public get mediaFilename(): string {
        let name = "";
        if (this.media?.file?.originalName) {
            name = this.media.file.originalName.replace(/\.[^/.]+$/, "");
        }
        return name;
    }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetTvShows, TvShowResponse, TvShowService } from '../api/tv-show.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const DEFAULT = {
    CURRENT_PAGE: 1,
    PER_PAGE: 10,
    OFFSET: 3
};

@Component({
    selector: 'app-tv-show-list',
    templateUrl: './tv-show-list.component.html',
    styleUrls: ['./tv-show-list.component.scss']
})
export class TvShowListComponent implements OnInit, OnDestroy {

    public tvShows: TvShowResponse[];

    public currentPage = DEFAULT.CURRENT_PAGE;
    private perPage = DEFAULT.PER_PAGE;

    private search: string;

    private totalCount: number;

    public pages = 0;
    public offset = DEFAULT.OFFSET;

    public onDelete = () => this.init();

    constructor(
        private readonly tvShowService: TvShowService,
        private readonly router: Router,
        private readonly socketService: SocketService
    ) {
        this.init();
    }

    ngOnInit(): void {
        this.socketService.socket.on(EVENTS.TV_SHOW_DELETE, this.onDelete);
    }

    public async init(): Promise<void> {
        await this.execSearch();
        if (!this.tvShows.length) {
            await this.router.navigate(["/add-tv-show"]);
        }
    }

    private async execSearch(): Promise<void> {
        const query: GetTvShows = {
            currentPage: this.currentPage.toString(),
            perPage: this.perPage.toString()
        };
        if (this.search?.trim()) {
            query.query = this.search;
        }
        const { tvShows, totalCount } = await this.tvShowService.getTvShows(query);
        this.tvShows = tvShows;
        this.totalCount = totalCount;
        this.pages = Math.ceil(this.totalCount / this.perPage);
    }

    public async onSearch(search: string): Promise<void> {
        if (search !== this.search) {
            this.tvShows = [];
            this.currentPage = DEFAULT.CURRENT_PAGE;
            this.perPage = DEFAULT.PER_PAGE;
        }
        this.search = search;
        await this.execSearch();
    }

    public async selectedPage(page: number): Promise<void> {
        this.currentPage = page;
        await this.execSearch();
    }

    public ngOnDestroy(): void {
        this.socketService.socket.removeEventListener(EVENTS.TV_SHOW_DELETE, this.onDelete);
    }

}

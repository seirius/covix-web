import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../api/movie.service';
import { TorrentClientService } from '../api/torrent-client.service';
import { TorrentFeedService, TfSource, MovieTfResponse, Feed, MovieTf } from '../api/torrent-feed.service';

const INPUTS = {
    SEARCH: "search"
};

const LIMIT = 10;
const OFFSET = 3;

@Component({
    selector: 'app-torrent-feed',
    templateUrl: './torrent-feed.component.html',
    styleUrls: ['./torrent-feed.component.scss']
})
export class TorrentFeedComponent implements OnInit {

    public formGroup: FormGroup = this.formBuilder.group({
        [INPUTS.SEARCH]: ["", Validators.required]
    });

    public response: MovieTfResponse;

    public pages = 0;
    public currentPage = 1;
    public offset = OFFSET;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly torrentFeedService: TorrentFeedService,
        private readonly movieService: MovieService,
        private readonly torrentClientService: TorrentClientService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
    }

    public async getMovies(): Promise<void> {
        this.response = await this.torrentFeedService.getMovies({
            query: this.formGroup.get(INPUTS.SEARCH).value,
            limit: LIMIT,
            page: this.currentPage,
            sources: [TfSource.YTS]
        });
        this.pages = Math.ceil(this.response.totalCount / LIMIT);
    }

    public async onSubmit(): Promise<void> {
        await this.getMovies();
    }

    public async selectedPage(page: number): Promise<void> {
        this.currentPage = page;
        await this.getMovies();
    }

    public async feedSelected(feed: Feed, tfMovie: MovieTf): Promise<void> {
        try {
            await this.movieService.addMovieFromTorrent({
                feed: feed.url,
                iconUrl: tfMovie.icon,
                label: tfMovie.label
            });
            this.router.navigate(["torrent-list"]);
        } catch (error) {
            console.error(error);
            alert(error?.error?.message);
        }
    }

}

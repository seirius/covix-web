import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Feed, MovieTf } from 'src/app/api/torrent-feed.service';

@Component({
    selector: 'app-tf-item',
    templateUrl: './tf-item.component.html',
    styleUrls: ['./tf-item.component.scss']
})
export class TfItemComponent implements OnInit {

    @Input()
    public movie: MovieTf;

    @Output()
    public feedSelected = new EventEmitter<Feed>();

    constructor() { }

    ngOnInit(): void {
    }

    public select(feed: Feed): void {
        this.feedSelected.emit(feed);
    }

}

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from "video.js";

@Component({
    selector: 'app-video-js',
    templateUrl: './video-js.component.html',
    styleUrls: ['./video-js.component.scss']
})
export class VideoJsComponent implements OnInit, OnDestroy {

    @ViewChild('target', { static: true }) target: ElementRef;
    @Input() options: {
        fluid: boolean,
        aspectRatio: string,
        autoplay: boolean,
        sources: {
            src: string,
            type: string,
        }[],
    };
    player: videojs.Player;

    constructor() { }

    private onPlayerReady() {
        // console.log('onPlayerReady', this);
    }

    ngOnInit() {
        this.player = videojs(this.target.nativeElement, this.options, () => this.onPlayerReady());
    }

    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }

}

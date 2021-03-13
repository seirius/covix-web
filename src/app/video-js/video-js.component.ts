import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import videojs from "video.js";

@Component({
    selector: 'app-video-js',
    templateUrl: './video-js.component.html',
    styleUrls: ['./video-js.component.scss']
})
export class VideoJsComponent implements OnInit, OnDestroy {

    @ViewChild('target', { static: true }) target: ElementRef;
    @Input() options: videojs.PlayerOptions;
    player: videojs.Player;

    @Output()
    public onPlay = new EventEmitter<{ currentTime: number }>();

    @Output()
    public onPause = new EventEmitter<{ currentTime: number }>();

    constructor() { }

    private onPlayerReady() {
        // console.log('onPlayerReady', this);
    }

    ngOnInit() {
        this.player = videojs(this.target.nativeElement, this.options, () => this.onPlayerReady());
        this.player.on("play", () => this.onPlay.emit({ currentTime: this.player.currentTime() }));
        this.player.on("pause", () => this.onPause.emit({ currentTime: this.player.currentTime() }));
    }

    public play(currentTime: number): void {
        this.player.currentTime(currentTime);
        this.player.play();
    }

    public pause(currentTime: number): void {
        this.player.pause();
    }

    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    }

}

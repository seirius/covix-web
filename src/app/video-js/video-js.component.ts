import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import videojs from "video.js";

export interface VideoButton {
    innerHTML: string;
    click: (this: GlobalEventHandlers, ev: MouseEvent) => any;
    title: string;
}

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
    public playerReady = new EventEmitter<void>();

    @Output()
    public onPlay = new EventEmitter<{ currentTime: number }>();

    @Output()
    public onPause = new EventEmitter<{ currentTime: number }>();

    @Input()
    public buttons: VideoButton[];

    constructor() { }

    private onPlayerReady() {
        this.playerReady.emit();
        this.player.on("play", () => this.onPlay.emit({ currentTime: this.player.currentTime() }));
        this.player.on("pause", () => this.onPause.emit({ currentTime: this.player.currentTime() }));
    }

    public addButton({ innerHTML, click, title }: VideoButton): void {
        const buttonEl = this.player.controlBar.addChild("button").el() as HTMLElement;
        buttonEl.innerHTML = innerHTML;
        buttonEl.onclick = click;
        buttonEl.setAttribute("title", title);
    }

    ngOnInit() {
        this.load();
    }

    public load(): void {
        this.player = videojs(this.target.nativeElement, this.options, () => this.onPlayerReady());
        if (this.buttons?.length) {
            this.buttons.forEach(button => this.addButton(button));
        }
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

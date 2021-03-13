import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from "video.js";
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from "src/app/socketio/socketio.data";
import { VideoJsComponent } from '../video-js/video-js.component';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {

    @ViewChild(VideoJsComponent) 
    videoJs: VideoJsComponent;
 
    public videoOptions: videojs.PlayerOptions = {
        autoplay: false,
        controls: true,
        sources: [],
        preload: "auto",
        bigPlayButton: false
    };

    public startVideo = false;

    public users: string[] = [];

    public id: string;

    private preventPlayEmit = false;
    private preventPauseEmit = false;

    constructor(
        private router: ActivatedRoute,
        private socketService: SocketService,
        private httpClient: HttpClient,
        private dataService: DataService
    ) {
        this.initVideo();
    }

    public addUser(username: string) {
        if (!this.users.includes(username)) {
            this.users.unshift(username);
        }
    }

    public removeUser(username: string) {
        const index = this.users.indexOf(username);
        if (index > -1) {
            this.users.splice(index, 1);
        }
    }

    private addSocketListeners(): void {
        this.socketService.socket.on(EVENTS.JOINED_ROOM, (username: string) => this.addUser(username));
        this.socketService.socket.on(EVENTS.LEAVE_ROOM, (username: string) => this.removeUser(username));
        this.socketService.socket.on(EVENTS.PLAY, ({ currentTime }: {
            currentTime: number
        }) => {
            this.preventPlayEmit = true;
            this.videoJs.play(currentTime);
        });
        this.socketService.socket.on(EVENTS.PAUSE, ({ currentTime }: {
            currentTime: number
        }) => {
            this.preventPauseEmit = true;
            this.videoJs.pause(currentTime);
        });
        this.socketService.socket.on(EVENTS.NEW_TRACK, ({ language }: { language: string }) => this.addTrack(language));
    }

    private removeSocketListeners(): void {
        this.socketService.socket.removeListener(EVENTS.JOINED_ROOM);
        this.socketService.socket.removeListener(EVENTS.LEAVE_ROOM);
        this.socketService.socket.removeListener(EVENTS.PLAY);
        this.socketService.socket.removeListener(EVENTS.PAUSE);
        this.socketService.socket.removeListener(EVENTS.NEW_TRACK);
    }

    public async loadTracks(): Promise<void> {
        this.videoOptions.tracks = [];
        const tracks = await this.httpClient.get<string[]>(`/api/room/${this.id}/tracks`).toPromise();
        if (tracks?.length) {
            tracks.forEach(track => this.videoOptions.tracks.push({
                src: `/api/room/${this.id}/track/${track}`,
                srclang: track,
                kind: "subtitles"
            }));
        }
    }

    public addTrack(language: string): void {
        this.videoJs.player.addRemoteTextTrack({
            src: `/api/room/${this.id}/track/${language}`,
            srclang: language,
            kind: "subtitles",
        }, true);
    }

    public initVideo(): void {
        this.addSocketListeners();
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.id = id;
                this.videoOptions.sources.push({
                    src: `/api/video?id=${id}`,
                    type: "video/mp4"
                });
                await this.loadTracks();
                this.startVideo = true;
                this.socketService.socket.emit(EVENTS.JOIN_ROOM, {
                    roomId: id,
                    username: this.dataService.username
                });
                const users = await this.httpClient.get<string[]>(`/api/room/${id}/users`).toPromise();
                if (users?.length) {
                    users.forEach(user => this.addUser(user));
                }
            }
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.removeSocketListeners();
        this.socketService.socket.emit(EVENTS.LEAVE_ROOM, {
            roomId: this.dataService.roomId
        });
    }

    public onPlay({ currentTime }: { currentTime: number }): void {
        if (this.preventPlayEmit) {
            this.preventPlayEmit = false;
            return;
        }
        this.socketService.socket.emit(EVENTS.PLAY, {
            roomId: this.id,
            currentTime
        });
    }

    public onPause({ currentTime }: { currentTime: number }): void {
        if (this.preventPauseEmit) {
            this.preventPauseEmit = false;
            return;
        }
        this.socketService.socket.emit(EVENTS.PAUSE, {
            roomId: this.id,
            currentTime
        });
    }

}

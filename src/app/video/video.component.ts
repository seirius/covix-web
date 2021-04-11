import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EVENTS } from "src/app/socketio/socketio.data";
import videojs from "video.js";
import { FileResponse } from '../api/file.service';
import { MediaSourceService } from '../api/media-source.service';
import { MediaResponse, MediaService } from '../api/media.service';
import { RoomDto, RoomService } from '../api/room.service';
import { TorrentResponse } from '../api/torrent-client.service';
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';
import { VideoJsComponent } from '../video-js/video-js.component';

function toVideoJsTrack(track: FileResponse): videojs.TextTrackOptions {
    return {
        src: `/api/media/${track.name}/track`,
        srclang: track.originalName.split(".")[0],
        kind: "subtitles"
    };
}

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
        liveui: true,
        bigPlayButton: true,
        muted: false
    };

    public startVideo = false;

    public users: string[] = [];

    public id: string;
    public room: RoomDto;

    private preventPlayEmit = false;
    private preventPauseEmit = false;

    private media: MediaResponse;
    public torrent: TorrentResponse;

    constructor(
        private router: ActivatedRoute,
        private socketService: SocketService,
        private dataService: DataService,
        private roomService: RoomService,
        private mediaService: MediaService,
        private mediaSourceService: MediaSourceService
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

    public updateRoomCurrentTime(): void {
        const currentTime = this.videoJs?.player?.currentTime();
        if (this.id && currentTime > 0) {
            this.socketService.socket.emit(EVENTS.REQUEST_CURRENT_TIME, {
                roomId: this.id,
                currentTime
            });
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
        this.socketService.socket.on(EVENTS.NEW_TRACK, (track: FileResponse) => this.addTrack(track));
        this.socketService.socket.on(EVENTS.REQUEST_CURRENT_TIME, () => this.updateRoomCurrentTime());
    }

    private removeSocketListeners(): void {
        Object.values(EVENTS)
            .forEach(event => this.socketService.socket.removeListener(event));
    }

    public onPlayerReady(): void {
        this.videoJs.player.currentTime(this.room.currentTime);
        this.emitPause(this.room.currentTime);
    }

    public loadTracks(tracks: FileResponse[]): void {
        this.videoOptions.tracks = [];
        if (tracks?.length) {
            tracks.forEach(track => this.videoOptions.tracks.push(toVideoJsTrack(track)));
        }
    }

    public async addTrack(track: FileResponse): Promise<void> {
        this.videoJs.player.addRemoteTextTrack(toVideoJsTrack(track), true);
    }

    private async getTorrentByMedia(id: string): Promise<TorrentResponse> {
        let response = null;
        try {
            this.torrent = await this.mediaSourceService.getTorrentByMedia(id);
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    public initVideo(): void {
        this.addSocketListeners();
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.id = id;
                this.dataService.roomId = id;
                this.room = await this.roomService.getRoom(this.id);
                this.media = await this.mediaService.getMedia(this.room.mediaId);
                this.videoOptions.sources.push({
                    src: `/api/media/${this.media.file.name}/video`,
                    type: "video/mp4"
                });
                this.loadTracks(this.media.tracks);
                if (this.room.users.length) {
                    this.room.users.forEach(user => this.addUser(user));
                }
                this.socketService.socket.emit(EVENTS.JOIN_ROOM, {
                    roomId: id,
                    username: this.dataService.username
                });
                await this.getTorrentByMedia(this.media.id);
                if (!this.torrent || this.torrent.progress >= .1) {
                    this.startVideo = true;
                }
            }
        });
    }

    public onTorrentProgress(progress: number) {
        if (progress > .1 && !this.startVideo) {
            this.startVideo = true;
        }
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

    public emitPause(currentTime: number): void {
        this.socketService.socket.emit(EVENTS.PAUSE, {
            roomId: this.id,
            currentTime
        });
    }

    public onPause({ currentTime }: { currentTime: number }): void {
        if (this.preventPauseEmit) {
            this.preventPauseEmit = false;
            return;
        }
        this.emitPause(currentTime);
    }

}

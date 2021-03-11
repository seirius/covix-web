import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from "video.js";
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
 
    public videoOptions: videojs.PlayerOptions = {
        autoplay: false,
        controls: true,
        sources: []
    };

    public startVideo = false;

    constructor(
        private router: ActivatedRoute,
        private socketService: SocketService,
        private dataService: DataService
    ) {
        this.initVideo();
    }

    public initVideo(): void {
        this.router.queryParams.subscribe(({ id }) => {
            if (id) {
                this.socketService.socket.on("joined-room", (username: string) => {
                    console.log(username);
                });
                this.videoOptions.sources.push({
                    src: `/api/video?id=${id}`,
                    type: "video/mp4"
                });
                this.startVideo = true;
                this.socketService.socket.emit("join-room", {
                    roomId: id,
                    username: this.dataService.username
                });
            }
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.socketService.socket.emit("leave-room", {
            roomId: this.dataService.roomId
        });
    }

}

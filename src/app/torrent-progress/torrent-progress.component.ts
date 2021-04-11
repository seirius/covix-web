import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TorrentResponse } from '../api/torrent-client.service';
import { SocketService } from '../socketio/socket.service';
import { torrentEvent } from '../socketio/socketio.data';

@Component({
    selector: 'app-torrent-progress',
    templateUrl: './torrent-progress.component.html',
    styleUrls: ['./torrent-progress.component.scss']
})
export class TorrentProgressComponent implements OnInit {

    @Input()
    public torrent: TorrentResponse;

    @Output()
    public onProgress = new EventEmitter<number>();

    public toMb = Math.pow(1024, 2);

    constructor(
        private readonly socketService: SocketService
    ) {
    }

    public updateTorrent(torrent: TorrentResponse): void {
        this.torrent.progress = torrent.progress;
        this.torrent.speed = torrent.speed;
        this.torrent.state = torrent.state;
        this.onProgress.emit(this.torrent.progress);
    }

    ngOnInit(): void {
        if (this.torrent) {
            this.socketService.socket.on(
                torrentEvent(this.torrent.name),
                (args: TorrentResponse) => this.updateTorrent(args)
            )
        }
    }

}

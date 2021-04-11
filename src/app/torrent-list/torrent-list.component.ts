import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaSourceService } from '../api/media-source.service';
import { RoomService } from '../api/room.service';
import { TorrentClientService, TorrentResponse } from '../api/torrent-client.service';
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';
import { torrentEvent } from '../socketio/socketio.data';

@Component({
    selector: 'app-torrent-list',
    templateUrl: './torrent-list.component.html',
    styleUrls: ['./torrent-list.component.scss']
})
export class TorrentListComponent implements OnInit, OnDestroy {

    public torrents: TorrentResponse[] = [];

    public toMb = Math.pow(1024, 2);

    public subs = [];

    constructor(
        private readonly torrentClientService: TorrentClientService,
        private readonly socketService: SocketService,
        private readonly router: Router,
        private readonly roomService: RoomService,
        private readonly dataService: DataService,
        private readonly mediaSourceService: MediaSourceService
    ) {
        this.getTorrents();
    }

    ngOnInit(): void {
    }

    public updateTorrent(torrent: TorrentResponse): void {
        const index = this.torrents.findIndex(({ id }) => torrent.id === id);
        if (index > -1) {
            const currentTorrent = this.torrents[index];
            currentTorrent.progress = torrent.progress;
            currentTorrent.speed = torrent.speed;
            currentTorrent.state = torrent.state;
        }
    }
    
    public async getTorrents(): Promise<void> {
        this.torrents = await this.torrentClientService.getTorrents();
        this.torrents.forEach(torrent => 
            this.subs.push(
                this.socketService.socket.on(
                    torrentEvent(torrent.name),
                    (args: TorrentResponse) => this.updateTorrent(args)
                )
            )
        )
    }

    public async watch(torrent: TorrentResponse): Promise<void> {
        const media = await this.mediaSourceService.getMediaByTorrent(torrent.id);
        const room = await this.roomService.newRoom(media.id, this.dataService.username);
        this.dataService.roomId = room.roomId;
        await this.router.navigate(["/video"], { queryParams: { id: room.roomId } });
    }

    ngOnDestroy(): void {
    }

}

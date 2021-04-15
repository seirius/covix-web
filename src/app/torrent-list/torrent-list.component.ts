import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaSourceService } from '../api/media-source.service';
import { RoomService } from '../api/room.service';
import { TorrentClientService, TorrentResponse, TorrentState } from '../api/torrent-client.service';
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS, torrentEvent } from '../socketio/socketio.data';

export interface TorrentWrapper {
    marked?: boolean;
    torrent: TorrentResponse;
}

@Component({
    selector: 'app-torrent-list',
    templateUrl: './torrent-list.component.html',
    styleUrls: ['./torrent-list.component.scss']
})
export class TorrentListComponent implements OnInit, OnDestroy {

    public torrents: TorrentWrapper[] = [];
    
    public toMb = Math.pow(1024, 2);

    public all = false;

    public loading = false;

    public subs: string[] = [];

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
        this.socketService.socket.on(
            EVENTS.TORRENT_ADD, 
            (torrent: TorrentResponse) => {
                const index = this.getIndex(torrent.id);
                if (index === -1) {
                    this.torrents.push({ marked: false, torrent });
                    this.listenToTorrent(torrent);
                }
            }
        );
        this.socketService.socket.on(
            EVENTS.TORRENT_DELETE,
            ({ id }: { id: string }) => {
                const index = this.getIndex(id);
                if (index > -1) {
                    this.torrents.splice(index, 1);
                }
            }
        );
        this.socketService.socket.on(
            EVENTS.TORRENT_PAUSE,
            (torrent: TorrentResponse) => this.updateTorrent({ marked: false, torrent })
        );
    }

    private getIndex(incId: string): number {
        return this.torrents.findIndex(({ torrent: { id }}) => incId === id);
    }

    public updateTorrent({ torrent }: TorrentWrapper): void {
        const index = this.getIndex(torrent.id);
        if (index > -1) {
            const { torrent: currentTorrent } = this.torrents[index];
            currentTorrent.progress = torrent.progress;
            currentTorrent.speed = torrent.speed;
            currentTorrent.state = torrent.state;
        }
    }

    private listenToTorrent(torrent: TorrentResponse): void {
        if (torrent.state !== TorrentState.DONE) {
            const torrentEventName = torrentEvent(torrent.name);
            this.subs.push(torrentEventName);
            this.socketService.socket.on(
                torrentEventName,
                (args: TorrentResponse) => this.updateTorrent({ torrent: args })
            );
        }
    }
    
    public async getTorrents(): Promise<void> {
        const torrentsRaw = await this.torrentClientService.getTorrents();
        this.torrents = torrentsRaw.map(torrent => {
            this.listenToTorrent(torrent);
            return {
                marked: false,
                torrent
            };
        });
    }

    public async watch(torrent: TorrentResponse): Promise<void> {
        const media = await this.mediaSourceService.getMediaByTorrent(torrent.id);
        const room = await this.roomService.newRoom(media.id, this.dataService.username);
        this.dataService.roomId = room.roomId;
        await this.router.navigate(["/video"], { queryParams: { id: room.roomId } });
    }

    public allChecked(): void {
        this.torrents.forEach(wrapper => wrapper.marked = this.all);
    }

    public wrapperChanged(wrapper: TorrentWrapper): void {
        this.all = this.torrents.map(({ marked }) => marked).every(marked => marked);
    }

    private get markedTorrents(): TorrentWrapper[] {
        return this.torrents
        .filter(({ marked }) => marked);
    }

    public async delete(): Promise<void> {
        this.loading = true;
        try {
            await Promise.all(
                this.markedTorrents
                .map(({ torrent: { id } }) => this.torrentClientService.deleteTorrent(id))
            );
        } catch (error) {
            console.error(error);
        }
        this.loading = false;
    }

    public async pause(): Promise<void> {
        this.loading = true;
        try {
            await Promise.all(
                this.markedTorrents
                .map(({ torrent: { id } }) => this.torrentClientService.pauseTorrent(id))
            );
        } catch (error) {
            console.error(error);
        }
        this.loading = false;
    }

    public async resume(): Promise<void> {
        this.loading = true;
        try {
            await Promise.all(
                this.markedTorrents
                .map(({ torrent: { id } }) => this.torrentClientService.resumeTorrent(id))
            );
        } catch (error) {
            console.error(error);
        }
        this.loading = false;
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => this.socketService.socket.removeEventListener(sub));
        this.socketService.socket.removeEventListener(EVENTS.TORRENT_DELETE);
        this.socketService.socket.removeEventListener(EVENTS.TORRENT_ADD);
    }

}

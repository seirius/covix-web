import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService, RoomWithMediaResponse } from '../api/room.service';

@Component({
    selector: 'app-live-rooms',
    templateUrl: './live-rooms.component.html',
    styleUrls: ['./live-rooms.component.scss']
})
export class LiveRoomsComponent implements OnInit {

    public rooms: RoomWithMediaResponse[];

    constructor(
        private readonly roomService: RoomService,
        private readonly router: Router
    ) {
        this.init();
    }

    ngOnInit(): void {
    }

    public async init(): Promise<void> {
        this.rooms = await this.roomService.getLiveRooms();
    }

    public joinRoom(room: RoomWithMediaResponse): void {
        this.router.navigate(["/movies-room"], { queryParams: { id: room.roomId } });
    }

}

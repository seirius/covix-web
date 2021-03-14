import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Room } from "./room.data";

@Injectable()
export class RoomService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public getRoom(roomId: string): Promise<Room> {
        return this.httpClient.get<Room>(`/api/room/${roomId}`).toPromise();
    }

}

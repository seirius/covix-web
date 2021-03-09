import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { connect } from "socket.io-client";

@Injectable()
export class SocketService {

    public socket: SocketIOClient.Socket;

    constructor(
        private httpClient: HttpClient
    ) {}

    public async init(): Promise<void> {
        const { socketPath } = await this.httpClient
            .get<any>("/api/socket-path")
            .toPromise();
        this.socket = connect(socketPath);
    }

}
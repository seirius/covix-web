import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from './socketio/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public links = [
        { title: "New Room", fragment: "new-room" },
        { title: "Join Room", fragment: "join-room" }
    ];

    public connected = false;

    constructor(
        public route: ActivatedRoute,
        private socketService: SocketService
    ) {
    }
    
    async ngOnInit(): Promise<void> {
        await this.socketService.init();
        this.socketService.socket.on("connect", () => this.connected = true);
    }

}

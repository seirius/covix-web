import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './data.service';
import { SocketService } from './socketio/socket.service';
import { EVENTS } from './socketio/socketio.data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public links = [
        { title: "Movies", fragment: "movies" },
        { title: "Add Movie", fragment: "add-movie" },
        { title: "Live rooms", fragment: "live-rooms" }
    ];

    public connected = false;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private socketService: SocketService,
        private dataService: DataService
    ) {
    }
    
    async ngOnInit(): Promise<void> {
        await this.socketService.init();
        this.socketService.socket.on("connect", () => this.connected = true);
        this.socketService.socket.on(EVENTS.CLIENT_ID, (clientId: string) => this.dataService.clientId = clientId);
    }

    public covixClick(): void {
        this.router.navigate(["/"]);
    }

    public get username(): string {
        return this.dataService.username;
    }

}

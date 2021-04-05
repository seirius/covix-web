import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResponse, UserService } from '../api/user.service';
import { DataService } from '../data.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const INPUTS = {
    USERNAME: "username"
}

@Component({
    selector: 'app-user-selection',
    templateUrl: './user-selection.component.html',
    styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit {

    public users: UserResponse[];

    public formGroup = this.formBuilder.group({
        [INPUTS.USERNAME]: [null, Validators.required],
    });

    constructor(
        private readonly userService: UserService,
        private readonly formBuilder: FormBuilder,
        private readonly dataService: DataService,
        private readonly router: Router,
        private readonly socketService: SocketService
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        this.users = await this.userService.getFreeUsers();
    }

    ngOnInit(): void {
        this.socketService.socket.on(EVENTS.USER_LEFT, () => this.init());
        this.socketService.socket.on(EVENTS.USER_JOINED, () => this.init());
        this.socketService.socket.on(EVENTS.NEW_USER, () => this.init());
    }

    public async onSubmit(): Promise<void> {
        const username = this.formGroup.get(INPUTS.USERNAME).value;
        if (username.trim()) {
            await this.userService.saveUser({ username });
            await this.init();
        }
    }

    public async selectUser(user: UserResponse): Promise<void> {
        this.dataService.username = user.username;
        await this.userService.updateClientId({
            username: user.username,
            clientId: this.dataService.clientId
        });
        if (this.dataService.backtrace) {
            await this.router.navigate([this.dataService.backtrace.url], {
                queryParams: this.dataService.backtrace.params
            });
            this.dataService.backtrace = null;
        } else {
            await this.router.navigate(["/movies"]);
        }
    }

}

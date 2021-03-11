import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

const INPUTS = {
    USERNAME: "username",
    ID: "id"
}

@Component({
    selector: 'app-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

    public formGroup = this.formBuilder.group({
        [INPUTS.USERNAME]: [null, Validators.required],
        [INPUTS.ID]: [null, Validators.required]
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly httpClient: HttpClient,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly dataService: DataService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.id) {
                this.formGroup.get(INPUTS.ID).setValue(params.id);
            }
        });
    }

    ngOnInit(): void {
    }

    public async onSubmit(): Promise<void> {
        const username = this.formGroup.get(INPUTS.USERNAME).value;
        const roomId = this.formGroup.get(INPUTS.ID).value;
        if (roomId) {
            this.dataService.username = username;
			this.dataService.roomId = roomId;
            await this.router.navigate(["/video"], { queryParams: { id: roomId } });
        }
    }

}

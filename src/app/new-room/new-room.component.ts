import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

const INPUTS = {
	USERNAME: "username",
	VIDEO_FILE: "videoFile",
};

@Component({
	selector: 'app-new-room',
	templateUrl: './new-room.component.html',
	styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {

	public submitting = false;

	public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.USERNAME]: [null, Validators.required],
		[INPUTS.VIDEO_FILE]: [null, Validators.required]
	});

	constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private httpClient: HttpClient,
		private router: Router,
		private dataService: DataService
	) {
	}

	ngOnInit(): void {
	}

	public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		const username = this.formGroup.get(INPUTS.USERNAME).value;
		formData.append(INPUTS.VIDEO_FILE, this.formGroup.get(INPUTS.VIDEO_FILE).value);
		const { roomId } = await this.httpClient.post<{
			roomId: string;
			usernames: string[]
		}>("/api/new-room", formData).toPromise();
		if (roomId) {
			this.dataService.roomId = roomId;
			this.dataService.username = username;
			this.router.navigate(["/video"], { queryParams: {
				id: roomId
			}});
		}
		this.submitting = false;
	}

	public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [ file ] = event.target.files;
			this.formGroup.get(INPUTS.VIDEO_FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

}

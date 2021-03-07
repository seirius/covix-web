import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

	public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.USERNAME]: [null, Validators.required],
		[INPUTS.VIDEO_FILE]: [null, Validators.required]
	});

	constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private httpClient: HttpClient,
		private router: Router
	) {
	}

	ngOnInit(): void {
	}

	public async onSubmit(): Promise<void> {
		const formData = new FormData();
		formData.append(INPUTS.VIDEO_FILE, this.formGroup.get(INPUTS.VIDEO_FILE).value);
		formData.append(INPUTS.USERNAME, this.formGroup.get(INPUTS.USERNAME).value);
		console.log(this.formGroup);
		const response = await this.httpClient.post<any>("/api/new-room", formData).toPromise();
		if (response.id) {
			this.router.navigate(["/video"], { queryParams: {
				id: response.id
			}});
		}
	}

	public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [ file ] = event.target.files;
			this.formGroup.get(INPUTS.VIDEO_FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

}

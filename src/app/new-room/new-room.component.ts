import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { scan } from "rxjs/operators";
import { Subscription } from 'rxjs';

const INPUTS = {
	USERNAME: "username",
	VIDEO_FILE: "videoFile",
};

export interface Upload {
	progress: number
	state: 'PENDING' | 'IN_PROGRESS' | 'DONE',
	response?: {
		roomId: string;
		usernames: string[];
	}
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
	return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
	event: HttpEvent<unknown>
): event is HttpProgressEvent {
	return (
		event.type === HttpEventType.DownloadProgress ||
		event.type === HttpEventType.UploadProgress
	);
}

const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
	if (isHttpProgressEvent(event)) {
		return {
			progress: event.total
				? Math.round((100 * event.loaded) / event.total)
				: upload.progress,
			state: 'IN_PROGRESS',
		};
	}
	if (isHttpResponse(event)) {
		return {
			progress: 100,
			state: 'DONE',
			response: event.body as any
		};
	}
	return upload;
}

@Component({
	selector: 'app-new-room',
	templateUrl: './new-room.component.html',
	styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {

	public submitting = false;
	public progress = 0;

	public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.USERNAME]: [null, Validators.required],
		[INPUTS.VIDEO_FILE]: [null, Validators.required]
	});

	private sub: Subscription;

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

	public uploadVideo(formData: FormData, onProgress: (progress: number) => void): Promise<{
		roomId: string;
		usernames: string[];
	}> {
		const initialState: Upload = { state: 'PENDING', progress: 0 };
		return new Promise((resolve) => {
			this.sub = this.httpClient.post("/api/new-room", formData, {
				reportProgress: true,
				observe: "events"
			}).pipe(scan(calculateState, initialState)).subscribe(tick => {
				switch(tick.state) {
					case "DONE":
						resolve(tick.response);
						this.sub.unsubscribe();
						break;
					case "IN_PROGRESS":
						onProgress(tick.progress);
						break;
				}
			});
		});
	}

	public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		const username = this.formGroup.get(INPUTS.USERNAME).value;
		formData.append(INPUTS.VIDEO_FILE, this.formGroup.get(INPUTS.VIDEO_FILE).value);
		const { roomId } = await this.uploadVideo(formData, (progress) => this.progress = progress);
		if (roomId) {
			this.dataService.roomId = roomId;
			this.dataService.username = username;
			this.router.navigate(["/video"], {
				queryParams: {
					id: roomId
				}
			});
		}
		this.submitting = false;
	}

	public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
			this.formGroup.get(INPUTS.VIDEO_FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

}

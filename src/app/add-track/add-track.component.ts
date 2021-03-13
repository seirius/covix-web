import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const INPUTS = {
	LANGUAGE: "language",
	SUBTITLE_FILE: "subtitleFile",
};

@Component({
    selector: 'app-add-track',
    templateUrl: './add-track.component.html',
    styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit {

	public submitting = false;

    @Input()
    public roomId: string;

	@ViewChild("file")
	public file: ElementRef;

    public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.LANGUAGE]: [null, Validators.required],
		[INPUTS.SUBTITLE_FILE]: [null, Validators.required]
	});

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
        private httpClient: HttpClient,
		private socketService: SocketService
    ) { }

    ngOnInit(): void {
    }

    public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		const language = this.formGroup.get(INPUTS.LANGUAGE).value;
		formData.append(INPUTS.SUBTITLE_FILE, this.formGroup.get(INPUTS.SUBTITLE_FILE).value);
        formData.append(INPUTS.LANGUAGE, language);
		await this.httpClient.post<void>(`api/room/${this.roomId}/track`, formData).toPromise();
        this.formGroup.reset();
		this.file.nativeElement.value = null;
		this.socketService.socket.emit(EVENTS.NEW_TRACK, { roomId: this.roomId, language });
		this.submitting = false;
	}

    public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [ file ] = event.target.files;
			this.formGroup.get(INPUTS.SUBTITLE_FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

}

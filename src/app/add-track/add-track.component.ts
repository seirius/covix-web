import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../api/file.service';
import { MediaService } from '../api/media.service';
import { RoomDto } from '../api/room.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const INPUTS = {
	FILE: "file",
};

@Component({
    selector: 'app-add-track',
    templateUrl: './add-track.component.html',
    styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit {

	public submitting = false;
	
    @Input()
    private room: RoomDto;

	@ViewChild("file")
	public file: ElementRef;

    public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.FILE]: [null, Validators.required]
	});

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private socketService: SocketService,
		private mediaService: MediaService,
		private fileService: FileService
    ) { }

    ngOnInit(): void {

    }

    public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		formData.append(INPUTS.FILE, this.formGroup.get(INPUTS.FILE).value);
		const fileResponse = await this.fileService.uploadFile(formData);
		await this.mediaService.addTrack(this.room.mediaId, fileResponse.name);
        this.formGroup.reset();
		this.file.nativeElement.value = null;
		this.socketService.socket.emit(EVENTS.NEW_TRACK, { roomId: this.room.roomId, track: fileResponse });
		this.submitting = false;
	}

    public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [ file ] = event.target.files;
			this.formGroup.get(INPUTS.FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

}

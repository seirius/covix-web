import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from '../api/file.service';
import { MovieResponse, MovieService } from '../api/movie.service';
import { RoomService } from '../api/room.service';
import { DataService } from '../data.service';

const INPUTS = {
	LABEL: "label",
	FILE: "file",
	TORRENT_FEED: "torrent_feed",
	ICON_URL: "iconUrl",
	ICON: "icon"
};

@Component({
    selector: 'app-add-movie',
    templateUrl: './add-movie.component.html',
    styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent implements OnInit {

    public submitting = false;
	public progress = 0;

    public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.LABEL]: [null, Validators.required],
		[INPUTS.FILE]: null,
		[INPUTS.TORRENT_FEED]: null,
		[INPUTS.ICON_URL]: [null],
		[INPUTS.ICON]: [null]
	});

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private readonly fileService: FileService,
		private readonly movieService: MovieService,
		private readonly roomService: RoomService,
		private readonly dataService: DataService,
		private readonly router: Router
    ) { }

	public async uploadIcon(): Promise<string> {
		const icon = this.formGroup.get(INPUTS.ICON).value;
		if (icon) {
			const iconData = new FormData();
			iconData.append("file", icon);
			const { name } = await this.fileService.uploadFile(iconData);
			return name;
		}
		return null;
	}


	public async onSubmit(): Promise<void> {
		if (this.formGroup.valid) {
			this.submitting = true;
			const feed = this.formGroup.get(INPUTS.TORRENT_FEED).value;
			const file = this.formGroup.get(INPUTS.FILE).value;
			if (!feed && !file) {
				alert("A feed or a video file is required");
			}
			const label = this.formGroup.get(INPUTS.LABEL).value;
			const iconUrl = this.formGroup.get(INPUTS.ICON_URL).value;
			const icon = await this.uploadIcon();
			const formData = new FormData();
			let movieResponse: MovieResponse;
			if (feed) {
				movieResponse = await this.movieService
				.addMovieFromTorrent({ feed, label, icon, iconUrl });
			} else {
				formData.append(INPUTS.FILE, this.formGroup.get(INPUTS.FILE).value);
				const { name } = await this.fileService.uploadFile(formData, progress => this.progress = progress);
				movieResponse = await this.movieService.addMovie({ name, label, iconUrl, icon });
			}
			const room = await this.roomService.newRoom(movieResponse.mediaId, this.dataService.user.username);
			this.dataService.roomId = room.roomId;
			await this.router.navigate(["/movies-room"], { queryParams: { id: room.roomId } });
			this.progress = 0;
			this.submitting = false;
		}
	}

    public onFileChange(event, field: string) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
			this.formGroup.get(field).setValue(file);
			this.cd.markForCheck();
		}
	}

    ngOnInit(): void {
    }

}

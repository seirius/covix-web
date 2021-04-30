import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../api/file.service';
import { MovieResponse, MovieService } from '../api/movie.service';
import { SocketService } from '../socketio/socket.service';
import { EVENTS } from '../socketio/socketio.data';

const INPUTS = {
	LABEL: "label",
	FILE: "file",
	TORRENT_FEED: "torrent_feed",
	ICON_URL: "iconUrl",
	ICON: "icon"
};
@Component({
    selector: 'app-movie-profile',
    templateUrl: './movie-profile.component.html',
    styleUrls: ['./movie-profile.component.scss']
})
export class MovieProfileComponent implements OnInit {

    public updLabel = false;
    public updIconUrl = false;
    public updIcon = false;
    public updFile = false;
    public updFeed = false;

	public progress = 0;

    public movieResponse: MovieResponse;

    public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.LABEL]: [null, Validators.required],
		[INPUTS.ICON_URL]: null,
		[INPUTS.ICON]: null,
        [INPUTS.FILE]: null,
        [INPUTS.TORRENT_FEED]: null
	});

    public ICON = INPUTS.ICON;
    public FILE = INPUTS.FILE;

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
        private readonly router: ActivatedRoute,
        private readonly routerToMove: Router,
        private readonly movieService: MovieService,
        private readonly fileService: FileService,
        private readonly socketService: SocketService
    ) {
        this.initMovie();
    }

    public initMovie(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                this.movieResponse = await this.movieService.getMovie(id);
                if (!this.movieResponse) {
                    this.routerToMove.navigate(["/movies"]);
                } else {
                    this.socketService.socket.on(EVENTS.MOVIE_DELETE, (deletedId: string) => {
                        if (id === deletedId) {
                            this.routerToMove.navigate(["/movies"]);
                        }
                    });
                    this.formGroup.controls[INPUTS.LABEL].setValue(this.movieResponse.label);
                    this.formGroup.controls[INPUTS.ICON_URL].setValue(this.movieResponse.iconUrl);
                }
            } else {
                alert("Not valid movie's id");
            }
        });
    }

    private log(error: Error): void {
        alert(JSON.stringify(error, null, 4));
    }

    public async changeLabel(): Promise<void> {
        this.updLabel = true;
        try {
            await this.movieService.updateMovie(this.movieResponse.id, { label: this.formGroup.get(INPUTS.LABEL).value});
        } catch (error) {
            this.log(error);
        }
        this.updLabel = false;
    }

    public async changeIconUrl(): Promise<void> {
        this.updIconUrl = true;
        try {
            await this.movieService.updateMovie(this.movieResponse.id, { iconUrl: this.formGroup.get(INPUTS.ICON_URL).value});
        } catch (error) {
            this.log(error);
        }
        this.updIconUrl = false;
    }

    public onFileChange(event, field: string) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
            this.formGroup.get(field).setValue(file);
			this.cd.markForCheck();
		}
	}

    public async onSubmit(): Promise<void> {}

    public async uploadIcon(): Promise<void> {
        this.updIcon = true;
        try {
            const icon = this.formGroup.get(INPUTS.ICON).value;
            if (icon) {
                const iconData = new FormData();
                iconData.append("file", icon);
                const { name } = await this.fileService.uploadFile(iconData);
                await this.movieService.updateMovie(
                    this.movieResponse.id,
                    { icon: name }
                );
                this.formGroup.controls[INPUTS.ICON_URL].setValue(null);
            }
        } catch (error) {
            this.log(error);
        }
        this.updIcon = false;
    }

    public async uploadFile(): Promise<void> {
        this.updFile = true;
        try {
            const formData = new FormData();
            formData.append(INPUTS.FILE, this.formGroup.get(INPUTS.FILE).value);
            const { name } = await this.fileService.uploadFile(formData, progress => this.progress = progress);
            await this.movieService.updateMovie(this.movieResponse.id, { name });
        } catch (error) {
            this.log(error);
        }
        this.updFile = false;
    }

    public async uploadFeed(): Promise<void> {
        this.updFeed = true;
        try {
            const feed = this.formGroup.get(INPUTS.TORRENT_FEED).value;
            if (feed) {
                await this.movieService.updateMovie(this.movieResponse.id, { feed });
                await this.routerToMove.navigate(["torrent-list"]);
            }
        } catch (error) {
            this.log(error);
        }
        this.updFeed = false;
    }

    ngOnInit(): void {
    }

}

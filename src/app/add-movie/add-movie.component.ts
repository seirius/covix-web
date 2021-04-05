import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from '../api/file.service';
import { MovieService } from '../api/movie.service';

const INPUTS = {
	LABEL: "label",
	FILE: "file",
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
		[INPUTS.FILE]: [null, Validators.required],
		[INPUTS.ICON_URL]: [null],
		[INPUTS.ICON]: [null]
	});

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private readonly fileService: FileService,
		private readonly movieService: MovieService,
		private readonly router: Router
    ) { }


	public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		formData.append(INPUTS.FILE, this.formGroup.get(INPUTS.FILE).value);
		const { name } = await this.fileService.uploadFile(formData, progress => this.progress = progress);
		let icon = this.formGroup.get(INPUTS.ICON).value;
		if (icon) {
			const iconData = new FormData();
			iconData.append("file", icon);
			const { name: iconName } = await this.fileService.uploadFile(iconData);
			icon = iconName;
		}
		const movieResponse = await this.movieService.addMovie({
			name,
			label: this.formGroup.get(INPUTS.LABEL).value,
			iconUrl: this.formGroup.get(INPUTS.ICON_URL).value,
			icon
		});
		this.progress = 0;
		this.submitting = false;
		this.router.navigate(["movie"], { queryParams: { id: movieResponse.id }});
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

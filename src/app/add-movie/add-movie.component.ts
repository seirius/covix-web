import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../api/file.service';
import { MovieService } from '../api/movie.service';

const INPUTS = {
	LABEL: "label",
	FILE: "file"
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
		[INPUTS.FILE]: [null, Validators.required]
	});

    constructor(
		private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
		private readonly fileService: FileService,
		private readonly movieService: MovieService
    ) { }


	public async onSubmit(): Promise<void> {
		this.submitting = true;
		const formData = new FormData();
		formData.append(INPUTS.FILE, this.formGroup.get(INPUTS.FILE).value);
		const { name } = await this.fileService.uploadFile(formData, progress => this.progress = progress);
		const movieResponse = await this.movieService.addMovie({
			name,
			label: this.formGroup.get(INPUTS.LABEL).value
		});
		console.log(movieResponse);
		this.progress = 0;
		this.submitting = false;
	}

    public onFileChange(event) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
			this.formGroup.get(INPUTS.FILE).setValue(file);
			this.cd.markForCheck();
		}
	}

    ngOnInit(): void {
    }

}

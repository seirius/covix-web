import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from '../api/file.service';
import { TvShowService } from '../api/tv-show.service';

const INPUTS = {
	LABEL: "label",
	ICON_URL: "iconUrl",
	ICON: "icon"
};

@Component({
    selector: 'app-add-tv-show',
    templateUrl: './add-tv-show.component.html',
    styleUrls: ['./add-tv-show.component.scss']
})
export class AddTvShowComponent implements OnInit {

    public submitting = false;

    public formGroup: FormGroup = this.formBuilder.group({
		[INPUTS.LABEL]: [null, Validators.required],
		[INPUTS.ICON_URL]: null,
		[INPUTS.ICON]: null
	});

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly fileService: FileService,
        private readonly router: Router,
        private readonly tvShowService: TvShowService,
        private readonly cdr: ChangeDetectorRef
    ) { }

    public onFileChange(event, field: string) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
			this.formGroup.get(field).setValue(file);
			this.cdr.markForCheck();
		}
	}

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

    private log(error: Error): void {
        alert(JSON.stringify(error, null, 4));
    }

    public async onSubmit(): Promise<void> {
        this.submitting = true;
        try {
            if (this.formGroup.valid) {
                const label = this.formGroup.get(INPUTS.LABEL).value;
                const iconUrl = this.formGroup.get(INPUTS.ICON_URL).value;
                const icon = await this.uploadIcon();
                const tvShowResponse = await this.tvShowService.createTvShow({
                    label, icon, iconUrl
                });
                await this.router.navigate(["/tv-show"], { queryParams: { id: tvShowResponse.id }});
            }
        } catch (error) {
            this.log(error);
        }
        this.submitting = false;
	}

    ngOnInit(): void {
    }

}

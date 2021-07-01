import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../api/file.service';
import { MediaResponse } from '../api/media.service';
import { SeasonResponse, TvShowResponse, TvShowService } from '../api/tv-show.service';

const INPUTS = {
	LABEL: "label",
	ICON_URL: "iconUrl",
	ICON: "icon"
};

@Component({
    selector: 'app-tv-show-profile',
    templateUrl: './tv-show-profile.component.html',
    styleUrls: ['./tv-show-profile.component.scss']
})
export class TvShowProfileComponent implements OnInit {

    public updLabel = false;
    public updIconUrl = false;
    public updIcon = false;

    public newSeasonName = "";

    public tvShowResponse: TvShowResponse;
    public seasons: SeasonResponse[];

    public formGroup: FormGroup = this.formBuilder.group({
        [INPUTS.LABEL]: [null, Validators.required],
        [INPUTS.ICON_URL]: null,
        [INPUTS.ICON]: null,
    });

    public ICON = INPUTS.ICON;

    constructor(
        private formBuilder: FormBuilder,
		private cd: ChangeDetectorRef,
        private readonly router: ActivatedRoute,
        private readonly routerToMove: Router,
        private readonly tvShowService: TvShowService,
        private readonly fileService: FileService
    ) { }

    ngOnInit(): void {
        this.router.queryParams.subscribe(async ({ id }) => {
            if (id) {
                const [tvShowResponse] = await Promise.all([
                    this.tvShowService.getTvShow(id),
                    this.loadSeasons(id)
                ]);
                this.tvShowResponse = tvShowResponse;
                if (!this.tvShowResponse) {
                    this.routerToMove.navigate(["/tv-shows"]);
                } else {
                    this.formGroup.controls[INPUTS.LABEL].setValue(this.tvShowResponse.label);
                    this.formGroup.controls[INPUTS.ICON_URL].setValue(this.tvShowResponse.iconUrl);
                }
            } else {
                alert("Non valid tv show's id");
            }
        });
    }

    private async loadSeasons(tvShowId: string): Promise<void> {
        this.seasons = await this.tvShowService.getSeasons(tvShowId);
    }

    private log(error: Error): void {
        alert(JSON.stringify(error, null, 4));
    }

    public async changeLabel(): Promise<void> {
        this.updLabel = true;
        try {
            await this.tvShowService.updateTvShow(this.tvShowResponse.id, { label: this.formGroup.get(INPUTS.LABEL).value});
        } catch (error) {
            this.log(error);
        }
        this.updLabel = false;
    }

    public async changeIconUrl(): Promise<void> {
        this.updIconUrl = true;
        try {
            await this.tvShowService.updateTvShow(this.tvShowResponse.id, { iconUrl: this.formGroup.get(INPUTS.ICON_URL).value});
        } catch (error) {
            this.log(error);
        }
        this.updIconUrl = false;
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
                await this.tvShowService.updateTvShow(
                    this.tvShowResponse.id,
                    { icon: name }
                );
                this.formGroup.controls[INPUTS.ICON_URL].setValue(null);
            }
        } catch (error) {
            this.log(error);
        }
        this.updIcon = false;
    }

    public onFileChange(event, field: string) {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
            this.formGroup.get(field).setValue(file);
			this.cd.markForCheck();
		}
	}

    public async onFileChangeElement(event, field: any, season: SeasonResponse): Promise<void> {
		if (event?.target?.files?.length) {
			const [file] = event.target.files;
            // field.setValue(file);
            const formData = new FormData();
            formData.append("file", file);
            (<any>season).progress = 0;
            const { name } = await this.fileService.uploadFile(formData, p => (<any>season).progress = p);
            const updatedSeason = await this.tvShowService.addEpisode({
                filename: name,
                seasonId: season.id,
            });
            const index = this.seasons.findIndex(({ id }) => id === updatedSeason.id);
            if (index > -1) {
                this.seasons[index] = updatedSeason;
            }
            field.value = null;
            (<any>season).progress = undefined;
		}
	}

    public async newSeason(): Promise<boolean> {
        try {
            const season = await this.tvShowService.addSeason({
                seasonLabel: this.newSeasonName,
                tvShowId: this.tvShowResponse.id
            });
            this.seasons.push(season);
        } catch (error) {
            this.log(error);
        }
        this.newSeasonName = "";
        return false;
    }



    public async removeEpisode(season: SeasonResponse, media: MediaResponse, acc: NgbAccordion, index: number): Promise<void> {
        try {
            const seasonResponse = await this.tvShowService.removeEpisode({
                mediaId: media.id,
                seasonId: season.id
            });
            const currSeason = this.seasons.find(({ id }) => id === seasonResponse.id);
            if (currSeason) {
                currSeason.medias = seasonResponse.medias;
                if (!currSeason.medias.length) {
                    acc.toggle(`acc${index}`);
                }
            }
        } catch (error) {
            console.error(error);
            this.log(error);
        }
    }


    public async updateEpisode(season: SeasonResponse, media: MediaResponse, index: number): Promise<void> {
        const updateSeason = await this.tvShowService.updateEpisodeIndex({
            mediaId: media.id,
            index
        });
        season.medias = updateSeason.medias;
    }

    public async deleteSeason(season: SeasonResponse): Promise<void> {
        const tvShow = await this.tvShowService.deleteSeason(season.id);
        this.seasons = tvShow.seasons;
    }

    public async updateSeasonIndex(season: SeasonResponse, index: number): Promise<void> {
        await this.tvShowService.updateSeasonIndex({
            seasonId: season.id,
            index
        });
        await this.loadSeasons(this.tvShowResponse.id);
    }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from "video.js";

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
 
    public videoOptions: videojs.PlayerOptions = {
        autoplay: false,
        controls: true,
        sources: []
    };

    public startVideo = false;

    constructor(
        private router: ActivatedRoute
    ) {
        this.initVideo();
    }

    public initVideo(): void {
        this.router.queryParams.subscribe(({ id }) => {
            if (id) {
                this.videoOptions.sources.push({
                    src: `/api/video?id=${id}`,
                    type: "video/mp4"
                });
                this.startVideo = true;
            }
        });
    }

    ngOnInit(): void {
    }

}
